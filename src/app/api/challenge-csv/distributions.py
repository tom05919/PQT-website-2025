# distributions.py
import math, random
from typing import Callable, Dict, Any, Tuple

# ----------------------------
# Utility samplers (centered such that E[perf] = strength)
# Strength is expected to be a float (recommended in [0,1])
# ----------------------------

def sampler_normal(strength: float, params: Dict[str,Any]):
    # params: {'sd': float}
    sd = params.get('sd', 0.05)
    return random.gauss(strength, sd)

def sampler_laplace(strength: float, params: Dict[str,Any]):
    # Laplace (double exponential) with pdf ~ exp(-|x-mu|/b)
    b = params.get('b', 0.04)  # scale
    u = random.random() - 0.5
    return strength - b * math.copysign(math.log(1 - 2*abs(u)), u)  # invert CDF

def sampler_student_t(strength: float, params: Dict[str,Any]):
    # Student-t centered at strength: sample t and scale to desired SD
    df = params.get('df', 3)
    scale = params.get('scale', 0.06)
    # Use random.gauss for simple approx? Better: use Box-Muller + student-t transform
    # We'll use python's random.gammavariate for chi2-like: see relation t = z/sqrt(chi2/df)
    z = random.gauss(0,1)
    chi2 = random.gammavariate(df/2.0, 2.0)  # gamma(k=df/2, theta=2) -> chi2
    t = z / math.sqrt(chi2 / df)
    return strength + scale * t

def sampler_logistic(strength: float, params: Dict[str,Any]):
    # Logistic with mean=0 and scale s. Use inverse CDF.
    s = params.get('s', 0.04)
    u = random.random()
    g = math.log(u / (1 - u))  # logit
    return strength + s * g

def sampler_lognormal(strength: float, params: Dict[str,Any]):
    # We want E[perf] = strength; for LogNormal with parameters (mu, sigma):
    # E = exp(mu + sigma^2/2) => mu = log(strength) - sigma^2/2
    sigma = params.get('sigma', 0.2)
    if strength <= 0:
        # fallback to normal relative multiplicative noise
        eps = random.gauss(0, params.get('rel_sd', 0.1))
        return max(0.0, strength * (1 + eps))
    mu = math.log(max(1e-6, strength)) - 0.5 * sigma * sigma
    val = random.lognormvariate(mu, sigma)
    return val

def sampler_beta(strength: float, params: Dict[str,Any]):
    # Strength in (0,1). Choose concentration k to control variance.
    k = params.get('k', 30.0)  # higher = concentrated near mean
    alpha = max(1e-6, strength * k)
    beta = max(1e-6, (1.0 - strength) * k)
    # sample Beta via two Gammas
    g1 = random.gammavariate(alpha, 1.0)
    g2 = random.gammavariate(beta, 1.0)
    if g1 + g2 == 0:
        return strength
    return g1 / (g1 + g2)

def sampler_mixture_normal(strength: float, params: Dict[str,Any]):
    # mixture: p * N(mu + delta, sd1) + (1-p) * N(mu - delta2, sd2)
    p = params.get('p', 0.3)
    delta = params.get('delta', 0.07)
    sd1 = params.get('sd1', 0.03)
    sd2 = params.get('sd2', 0.06)
    if random.random() < p:
        return random.gauss(strength + delta, sd1)
    else:
        return random.gauss(strength - delta, sd2)

def sampler_max_of_n(strength: float, params: Dict[str,Any]):
    # max of n Gaussian draws (gives heavy right tail)
    n = params.get('n', 3)
    sd = params.get('sd', 0.05)
    draws = [random.gauss(strength - 0.02, sd) for _ in range(n)]
    val = max(draws)
    # scale to roughly keep mean ~ strength (simple scaling)
    # optional: compute expected max and rescale. Here just return val
    return val

def sampler_skew_normal_approx(strength: float, params: Dict[str,Any]):
    # Simple skewed approx: combine abs of a Gaussian to create positive skew
    sd = params.get('sd', 0.05)
    rho = params.get('rho', 0.6)  # 0..1 controls skew
    z1 = abs(random.gauss(0,1))
    z2 = random.gauss(0,1)
    z = rho * z1 + (1 - rho) * z2
    return strength + sd * z

# Map name -> sampler
SAMPLERS = {
    'normal': sampler_normal,
    'laplace': sampler_laplace,
    'student_t': sampler_student_t,
    'logistic': sampler_logistic,
    'lognormal': sampler_lognormal,
    'beta': sampler_beta,
    'mixture_normal': sampler_mixture_normal,
    'max_of_n': sampler_max_of_n,
    'skew_normal_approx': sampler_skew_normal_approx
}

# ----------------------------
# Probability estimation
# ----------------------------

def prob_mc_vs(strA: float, strB: float,
               samplerA: Callable, samplerB: Callable,
               paramsA: Dict[str,Any], paramsB: Dict[str,Any],
               trials: int = 2000, rng_seed: int = None) -> float:
    """Monte Carlo probability that A beats B using provided samplers."""
    if rng_seed is not None:
        random.seed(rng_seed)
    count = 0
    for _ in range(trials):
        a = samplerA(strA, paramsA)
        b = samplerB(strB, paramsB)
        if a > b:
            count += 1
    return count / trials

# Analytic for Gaussian difference
def prob_normal_analytic(strA: float, strB: float, sdA: float, sdB: float):
    # Prob(A > B) where A~N(strA, sdA^2), B~N(strB, sdB^2)
    diff_mean = strA - strB
    diff_sd = math.sqrt(sdA*sdA + sdB*sdB)
    if diff_sd <= 1e-12:
        return 0.5 if abs(diff_mean) < 1e-12 else (1.0 if diff_mean > 0 else 0.0)
    z = diff_mean / diff_sd
    # Normal CDF
    return 0.5 * (1 + math.erf(z / math.sqrt(2)))

# Analytic for Logistic (approx mapping to logistic CDF)
def prob_logistic_analytic(strA: float, strB: float, scaleA: float, scaleB: float):
    # If we treat A = strA + scaleA * G where G is standard logistic,
    # difference distribution is logistic-like; a convenient approximation:
    # Use Bradley-Terry logistic formula if scales equal:
    if abs(scaleA - scaleB) < 1e-9:
        # maps to logistic comparison: prob = sigmoid( (strA - strB) / s )
        s = scaleA
        x = (strA - strB) / s
        return 1.0 / (1.0 + math.exp(-x))
    else:
        # fallback to MC
        return None

# ----------------------------
# Helper: choose sampler from spec and compute prob
# distribution_spec example:
# { 'name': 'normal', 'params': {'sd': 0.05} }
# ----------------------------
def get_sampler_from_spec(spec: Dict[str,Any]) -> Callable:
    name = spec.get('name', 'normal')
    params = spec.get('params', {})
    func = SAMPLERS.get(name)
    if func is None:
        raise ValueError(f"Unknown sampler {name}")
    return lambda s: func(s, params)

def probability_A_beats_B(teamA_strength: float, teamB_strength: float,
                          specA: Dict[str,Any], specB: Dict[str,Any],
                          trials_mc: int = 3000, rng_seed: int = None) -> float:
    """
    Compute probability that A beats B. Try analytic when both normal or logistic,
    else fall back to Monte Carlo using specified samplers.
    """
    nameA = specA.get('name', 'normal')
    nameB = specB.get('name', 'normal')
    paramsA = specA.get('params', {})
    paramsB = specB.get('params', {})

    # # analytic normal-normal
    # if nameA == 'normal' and nameB == 'normal':
    #     sdA = paramsA.get('sd', 0.05)
    #     sdB = paramsB.get('sd', 0.05)
    #     return prob_normal_analytic(teamA_strength, teamB_strength, sdA, sdB)

    # # analytic logistic-logistic (simple BT-like)
    # if nameA == 'logistic' and nameB == 'logistic':
    #     scaleA = paramsA.get('s', 0.04)
    #     scaleB = paramsB.get('s', 0.04)
    #     res = prob_logistic_analytic(teamA_strength, teamB_strength, scaleA, scaleB)
    #     if res is not None:
    #         return res

    # fallback: Monte Carlo using samplers
    samplerA = SAMPLERS[nameA]
    samplerB = SAMPLERS[nameB]
    if rng_seed is not None:
        random.seed(rng_seed)
    count = 0
    for _ in range(trials_mc):
        a = samplerA(teamA_strength, paramsA)
        b = samplerB(teamB_strength, paramsB)
        if a > b:
            count += 1
    return count / trials_mc

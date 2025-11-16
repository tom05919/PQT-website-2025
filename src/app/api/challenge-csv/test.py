import numpy as np
import matplotlib.pyplot as plt
from scipy.stats import norm, beta, uniform, expon, triang

# -----------------------------
# 1. Define PDFs for attributes
# -----------------------------
# You can customize these however you want.

# Home game advantage: normal distribution (mean 1, std 0.3)
home_game_adv_pdf = norm(loc=1.0, scale=0.3)

# Offense: beta distribution (0–1 range)
offense_pdf = beta(a=5, b=2)

# Defense: triangular distribution (0–1 range, peak at 0.7)
defense_pdf = triang(c=0.7)

# Injury risk: exponential distribution (shifted to be small)
injury_pdf = expon(scale=0.3)

# Team chemistry: uniform distribution (0–1 range)
chemistry_pdf = uniform(loc=0, scale=1)


# -----------------------------
# 2. Simulation parameters
# -----------------------------
NUM_TEAMS = 32

scores = []

# -----------------------------
# 3. Sample attributes & compute score
# -----------------------------
for _ in range(NUM_TEAMS):
    home_game_adv = home_game_adv_pdf.rvs()
    offense = offense_pdf.rvs()
    defense = defense_pdf.rvs()  # defense unused in formula but still sampled
    injury = injury_pdf.rvs()
    chemistry = chemistry_pdf.rvs()
    
    # randomly assign home or away
    is_home = np.random.choice([0, 1])
    
    # Score function
    score = (1 - injury) * (3 * offense) + chemistry + is_home * (home_game_adv * chemistry)
    scores.append(score)


# -----------------------------
# 4. Plot distribution
# -----------------------------
plt.figure(figsize=(10, 5))
plt.hist(scores, bins=10, edgecolor='black')
plt.title("Distribution of Team Scores")
plt.xlabel("Score")
plt.ylabel("Frequency")
plt.grid(alpha=0.3)
plt.show()
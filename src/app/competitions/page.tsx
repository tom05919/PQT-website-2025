import { permanentRedirect } from "next/navigation";

export default function CompetitionsRedirect() {
  permanentRedirect("/past-events");
}

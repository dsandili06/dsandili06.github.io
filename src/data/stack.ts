import type { StackGroup } from "@/types";

export const STACK_GROUPS: StackGroup[] = [
  {
    title: "FORENSE & TRIAGE",
    items: [
      "Volatility 3",
      "Autopsy",
      "FTK Imager",
      "Zimmerman Tools",
      "Velociraptor",
      "Timeline Explorer",
      "DB Browser",
    ],
  },
  {
    title: "MALWARE ANALYSIS",
    items: ["dnSpy", "ExtAnalysis", "CRX Viewer", "Hybrid Analysis", "Any.Run"],
  },
  {
    title: "SIEM & NETWORK",
    items: ["Splunk SPL", "ELK Stack", "Kibana", "Wireshark", "TShark", "Suricata", "Snort"],
  },
  {
    title: "SCRIPTING & OSINT",
    items: [
      "Python",
      "Bash",
      "PowerShell",
      "Shodan",
      "VirusTotal",
      "AbuseIPDB",
      "MalwareBazaar",
      "ThreatFox",
      "CyberChef",
    ],
  },
];

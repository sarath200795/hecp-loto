export const config = {
  "title": "HECP LOTO",
  "tagline": "Lockout / Tagout — document energy isolation procedures, generate QR tags, and track live lock state.",
  "org": "Northwind Manufacturing",
  "port": 5173,
  "walkthrough": [
    {
      "route": "/app",
      "title": "LOTO dashboard",
      "sub": "Procedures, lock state and pending approvals at a glance."
    },
    {
      "route": "/app/procedures/new",
      "title": "Create a procedure",
      "sub": "Add isolation points — energy source auto-numbers (E-1, M-1…), with hazard, photo and verification."
    },
    {
      "route": "/app/inventory",
      "title": "Procedure inventory",
      "sub": "All procedures, filterable by site, equipment and status; regenerate QR/PDF tags."
    },
    {
      "route": "/app/operations",
      "title": "LOTO operations",
      "sub": "Technicians lock and unlock each isolation point; status flips to “Locked” when all points are secured."
    },
    {
      "route": "/app/approvals",
      "title": "Approvals",
      "sub": "Safety / Engineering review and approve procedures before use."
    },
    {
      "route": "/app/locks",
      "title": "Lock inventory",
      "sub": "Track padlocks, hasps and chains across the organization."
    }
  ],
  "closing": {
    "route": "/app",
    "title": "HECP LOTO — isolate safely, every time.",
    "sub": "Start by registering your organization."
  }
}

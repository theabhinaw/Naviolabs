# Email and Lead Extractor
# Turns messy customer enquiries into a clean list of leads.
import re

raw_enquiries = """
Hi, I'm Priya Sharma. We run a boutique in Lucknow and want to reply faster on WhatsApp.
Mail me at priya.sharma@example.com or call +91 98765 43210.

Hello team, my name is Rahul Verma from Verma Traders.
Please send a quote for invoice automation. Email: rahul@vermatraders.in, phone 9123456780

Namaste, this is Anjali Singh (anjali.singh@example.org). Can we talk about a support chatbot? My number is 099887 76655.
"""

EMAIL = re.compile(r"[\w.+-]+@[\w-]+(?:\.[\w-]+)+")
PHONE = re.compile(r"(?:\+91[\s-]?)?0?\d{5}[\s-]?\d{5}")
NAME = re.compile(r"(?i:i'm|i am|my name is|this is)\s+([A-Z][a-z]+(?:\s[A-Z][a-z]+)?)")

INTERESTS = {
    "whatsapp": "WhatsApp automation",
    "invoice": "Invoice automation",
    "chatbot": "Support chatbot",
    "website": "Website or web app",
}


def tidy_phone(text):
    digits = re.sub(r"\D", "", text)[-10:]
    return f"+91 {digits[:5]} {digits[5:]}"


def find_interest(text):
    for word, label in INTERESTS.items():
        if word in text.lower():
            return label
    return "General enquiry"


leads = []
for enquiry in raw_enquiries.strip().split("\n\n"):
    name = NAME.search(enquiry)
    email = EMAIL.search(enquiry)
    phone = PHONE.search(enquiry)
    leads.append({
        "name": name.group(1) if name else "(not found)",
        "email": email.group(0).lower() if email else "(not found)",
        "phone": tidy_phone(phone.group(0)) if phone else "(not found)",
        "interest": find_interest(enquiry),
    })

print(f"Found {len(leads)} leads\n")
for number, lead in enumerate(leads, start=1):
    print(f"{number}. {lead['name']}")
    print(f"   Email:    {lead['email']}")
    print(f"   Phone:    {lead['phone']}")
    print(f"   Interest: {lead['interest']}\n")

print("Tip: replace the text in raw_enquiries with your own messages and press Run again.")

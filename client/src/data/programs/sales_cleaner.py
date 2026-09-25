# CSV Sales Data Cleaner
# Cleans messy invoice data, adds up revenue for each month and flags overdue invoices.
import csv
import io
from collections import defaultdict
from datetime import date, datetime

TODAY = date(2026, 9, 20)  # change this to today's date when you test your own data

csv_text = """invoice_id,customer,invoice_date,due_date,amount,status
INV-1001,Sharma Traders,2026-07-04,2026-07-19,"₹12,500",PAID
INV-1002,Kapoor Sweets,2026-07-18,2026-08-02,"₹8,200 ",paid
INV-1003,Verma Clinic,2026-08-03,2026-08-18,"₹25,000",Pending
INV-1004,Singh Motors,2026-08-11,2026-08-26,"₹18,500",pending
INV-1005,Gupta Books,2026-08-20,2026-09-04,"₹6,750",Paid
,,,,,
INV-1006,Khan Textiles,2026-09-02,2026-09-17,"₹41,000",Pending
INV-1007,Mishra Foods,2026-09-10,2026-09-25,"₹9,900",Pending
INV-1008,Yadav Agro,2026-09-12,2026-09-27,not sure,Paid
"""


def parse_amount(text):
    cleaned = text.replace("₹", "").replace(",", "").strip()
    return float(cleaned)  # raises ValueError when it is not a number


def inr(amount):
    """Format a number the Indian way: ₹1,25,000"""
    digits = str(int(round(amount)))
    if len(digits) <= 3:
        return "₹" + digits
    head, tail = digits[:-3], digits[-3:]
    groups = []
    while len(head) > 2:
        groups.insert(0, head[-2:])
        head = head[:-2]
    if head:
        groups.insert(0, head)
    return "₹" + ",".join(groups + [tail])


invoices, skipped = [], []
for row in csv.DictReader(io.StringIO(csv_text)):
    if not any((value or "").strip() for value in row.values()):
        continue  # empty line
    try:
        invoices.append({
            "id": row["invoice_id"].strip(),
            "customer": row["customer"].strip(),
            "month": row["invoice_date"].strip()[:7],
            "due": datetime.strptime(row["due_date"].strip(), "%Y-%m-%d").date(),
            "amount": parse_amount(row["amount"]),
            "paid": row["status"].strip().lower() == "paid",
        })
    except (ValueError, KeyError, AttributeError):
        skipped.append(row.get("invoice_id") or "(no id)")

months = defaultdict(lambda: {"billed": 0, "paid": 0})
for inv in invoices:
    months[inv["month"]]["billed"] += inv["amount"]
    if inv["paid"]:
        months[inv["month"]]["paid"] += inv["amount"]

print(f"Cleaned {len(invoices)} invoices. Skipped {len(skipped)} bad row(s): {', '.join(skipped) or 'none'}\n")
print(f"{'Month':<10}{'Billed':>12}{'Paid':>12}{'Unpaid':>12}")
for month in sorted(months):
    m = months[month]
    print(f"{month:<10}{inr(m['billed']):>12}{inr(m['paid']):>12}{inr(m['billed'] - m['paid']):>12}")

print("\nOverdue invoices (unpaid and past the due date):")
overdue = [inv for inv in invoices if not inv["paid"] and inv["due"] < TODAY]
for inv in sorted(overdue, key=lambda i: i["due"]):
    days = (TODAY - inv["due"]).days
    print(f"  ! {inv['id']}  {inv['customer']:<16}{inr(inv['amount']):>10}  {days} days late")

print(f"\nTotal waiting to be collected: {inr(sum(inv['amount'] for inv in overdue))}")

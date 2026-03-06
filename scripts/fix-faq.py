import re, pathlib

p = pathlib.Path("app/page.tsx")
src = p.read_text(encoding="utf-8")

new_faq = (
    '            <FAQAccordion\n'
    '              items={[\n'
    '                { q: "How do I join the club?", a: "Apply through the Join page and attend the orientation session." },\n'
    '                { q: "Do I need prior robotics experience?", a: "No. We run beginner tracks and pair new members with mentors." },\n'
    '                { q: "What projects can I work on?", a: "You can join ongoing research, build competition bots, or start a new idea." },\n'
    '                { q: "How often are workshops held?", a: "Weekly sessions with focused topics, plus seasonal bootcamps." },\n'
    '                { q: "Is there any membership fee?", a: "There is no fixed fee; some events may have small participation costs." },\n'
    '                { q: "Can first-year students apply?", a: "Yes, we welcome students from all years and departments." },\n'
    '                { q: "Do I need to own hardware?", a: "No, lab resources are provided for learning and projects." },\n'
    '                { q: "How are teams formed?", a: "Teams are formed by interest and skill balance after onboarding." },\n'
    '                { q: "Can I switch tracks later?", a: "Yes, you can move between tracks after completing basics." },\n'
    '                { q: "What is the time commitment?", a: "Most members spend 2-4 hours per week, more during competitions." },\n'
    '                { q: "How do I get updates?", a: "Follow the club pages and announcements on the website." },\n'
    '                { q: "Who can I contact for help?", a: "Use the Contact section or message the club on social media." },\n'
    '              ]}\n'
    '            />'
)

result = re.sub(r"<FAQAccordion\s+items=\{\[.*?\]\}\s*/>", new_faq, src, flags=re.DOTALL)

if result == src:
    print("NO MATCH")
else:
    p.write_text(result, encoding="utf-8")
    print("SUCCESS -", p.stat().st_size, "bytes written")

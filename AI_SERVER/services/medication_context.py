def format_medication_context(medications: list) -> str:
    if not medications:
        return "The patient has no medications currently recorded."
    formatted_lines = "\n".join([f"  - {med}" for med in medications])
    return f"The patient is currently prescribed:\n{formatted_lines}"

def build_full_context(medications: list, extra_info: dict = None) -> str:
    return format_medication_context(medications)
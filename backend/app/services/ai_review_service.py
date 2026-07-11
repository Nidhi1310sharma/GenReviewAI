"""
Calls the LLM (Claude API) to draft 2-3 short review options from the
customer's rating + selected tags (PRD section 7.3 / 8).

Status: STUB — folder wired up in Module 1. Real implementation
lands in Module 6, once ANTHROPIC_API_KEY is set in .env.
"""


def generate_review_drafts(business_name: str, category: str, tone: str, star_rating: int, tags: list[str]) -> list[str]:
    """TODO (Module 6): call the Anthropic API with the PRD's drafting rules
    (first person, natural/imperfect, no invented specifics, tone matches
    rating) and return 2-3 distinct 25-45 word drafts."""
    raise NotImplementedError("AI review drafting — build in Module 6.")

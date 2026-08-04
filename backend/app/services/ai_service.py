async def analyze_claim(claim: str):

    claim_lower = claim.lower()

    if "earth is flat" in claim_lower:
        return {
            "verdict": "False",
            "confidence": 99,
            "explanation": "Scientific evidence shows Earth is an oblate spheroid. Satellite observations, gravity measurements, and global navigation systems confirm this.",
            "sources": [
                "NASA",
                "National Geographic",
                "Encyclopaedia Britannica"
            ]
        }

    elif "water freezes" in claim_lower:
        return {
            "verdict": "Verified",
            "confidence": 98,
            "explanation": "Pure water freezes at approximately 0°C under standard atmospheric pressure.",
            "sources": [
                "Scientific references",
                "Chemistry textbooks"
            ]
        }

    else:
        return {
            "verdict": "Insufficient Evidence",
            "confidence": 50,
            "explanation": "The system needs more verified information to evaluate this claim.",
            "sources": [
                "Pending research"
            ]
        }
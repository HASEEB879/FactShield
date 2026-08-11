"use client";

export default function ContactButton() {
  const handleContact = () => {
    window.location.href =
      "mailto:support.factshield@gmail.com?subject=FactShield%20Feedback";
  };

  return (
    <button
      type="button"
      onClick={handleContact}
      className="text-left text-muted-foreground hover:text-foreground transition-colors"
    >
      Contact
    </button>
  );
}
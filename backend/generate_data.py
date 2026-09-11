import pandas as pd
import random

categories = ["Sports", "Politics", "Technology", "Business", "Entertainment"]

sample_texts = {
    "Sports": [
        "The local team won the championship in a thrilling final match.",
        "The star quarterback was injured during the first quarter.",
        "Olympic athletes are preparing for the upcoming summer games.",
        "A new world record was set in the 100m sprint.",
        "The tennis match lasted over five hours, ending in a spectacular tiebreak."
    ],
    "Politics": [
        "The president signed a new bill into law today regarding healthcare.",
        "The upcoming election is seeing record voter registration numbers.",
        "The senate debated the budget proposal for next fiscal year.",
        "The prime minister met with foreign delegates to discuss trade.",
        "Local council members voted against the new zoning regulations."
    ],
    "Technology": [
        "A major tech company unveiled its new smartphone with a revolutionary screen.",
        "Artificial intelligence is rapidly transforming the software industry.",
        "A new cybersecurity flaw was discovered in the popular web browser.",
        "Cloud computing adoption continues to rise among small businesses.",
        "The new quantum computer achieves unprecedented processing speeds."
    ],
    "Business": [
        "Stock markets reached an all-time high amidst economic recovery.",
        "The merger between the two corporate giants was finalized.",
        "Inflation rates have caused a rise in consumer goods prices.",
        "The startup raised $50 million in its latest funding round.",
        "Unemployment figures dropped significantly this quarter."
    ],
    "Entertainment": [
        "The new blockbuster movie broke box office records on its opening weekend.",
        "The famous pop star announced a worldwide stadium tour.",
        "Critics are praising the new drama series on the streaming platform.",
        "The annual music awards show featured surprise performances.",
        "The celebrity couple announced their engagement on social media."
    ]
}

def generate_dataset(num_samples_per_category=40):
    data = []
    for category in categories:
        for _ in range(num_samples_per_category):
            text = random.choice(sample_texts[category])
            # Add some slight variation
            words = text.split()
            random.shuffle(words)
            text_variant = " ".join(words) # Shuffled a bit for variety if needed, or just repeat
            # Actually, let's just use the sentence with some extra random noise to make tfidf work
            extra = random.choice(["It was unexpected.", "Experts say this is huge.", "More details at 11.", "What a time to be alive.", ""])
            data.append({"text": text + " " + extra, "category": category})
            
    df = pd.DataFrame(data)
    # Shuffle dataset
    df = df.sample(frac=1).reset_index(drop=True)
    df.to_csv("data/news_dataset.csv", index=False)
    print("Dataset generated at data/news_dataset.csv")

if __name__ == "__main__":
    generate_dataset()

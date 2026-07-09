import math
from collections import Counter


def calculate_entropy(text):
    """
    Calculate Shannon Entropy of a string.
    Higher entropy means the text is more random.
    """

    if not text:
        return 0

    counts = Counter(text)
    length = len(text)

    entropy = 0

    for count in counts.values():
        probability = count / length
        entropy -= probability * math.log2(probability)

    return round(entropy, 2)
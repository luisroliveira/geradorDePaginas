import re

def convert_to_json(input_text):
    persuasive_phrases = re.findall(r'Frases Persuasivas:(.*?)Texto Persuasivo:', input_text, re.DOTALL)
    persuasive_phrases = [re.sub(r'^\d+\.\s*|"', '', line.strip()) for line in persuasive_phrases[0].split('\n') if line.strip()]

    persuasive_text = re.findall(r'Texto Persuasivo:(.*?)Slogans:', input_text, re.DOTALL)
    persuasive_text = [re.sub(r'^\d+\.\s*|"', '', line.strip()) for line in persuasive_text[0].split('\n') if line.strip()]

    slogans = re.findall(r'Slogans:(.*?)(?:$|\0)', input_text, re.DOTALL)
    slogans = [re.sub(r'^\d+\.\s*|"', '', line.strip()) for line in slogans[0].split('\n') if line.strip()]

    json_response = {
        "Frases Persuasivas": persuasive_phrases,
        "Textos Persuasivos": persuasive_text,
        "Slogans": slogans,
        "Descricao": ["A classy barbershop setting, boasting a vintage appeal with polished wooden countertops, under the soft yet focused light that casts an inviting and professional ambiance.", "A minimalist bathroom setup, drenched in soft white light that highlights the product, creating a sense of cleanliness and sophistication.", "An outdoor setup during golden hour with the product placed on a rustic wooden table, creating a sense of adventure and independence.", "A close-up shot against a black textured background under focused studio lights, highlighting the sleek design of the razor, evoking a sense of luxury and precision."]
    }
    return json_response

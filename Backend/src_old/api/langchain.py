from dotenv import load_dotenv
from langchain.llms import OpenAI
import os
load_dotenv()

openai_api_key = os.getenv("OPENAI_API_KEY")
if not openai_api_key:
    raise ValueError("OPENAI_API_KEY is not set")



def generate_pet_name(pet_type: str):
    
    
    llm = OpenAI(temperature=0.6, model="gpt-3.5-turbo", api_key=openai_api_key)

    template = PromptTemplate(
        input_variables=['pet_type'],
        template="Generate a unique and creative name for a pet {pet_type}. The name should be fun, memorable, and suitable for a cat. The name should not be too long, ideally one or two words. Avoid common names like 'Whiskers' or 'Fluffy'."
    )
    
    mychain = LLMChain(llm=llm, prompt=template)

    response = mychain({'pet_type': pet_type})
    return response


if __name__ == "__main__":
    pet_type = "cat"
    name = generate_pet_name(pet_type)
    print(f"Generated pet name for {pet_type}: {name}")
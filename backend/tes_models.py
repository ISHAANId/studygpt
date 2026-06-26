import os
import google.generativeai as genai

genai.configure(api_key=os.environ["GOOGLE_API_KEY"])

for model in genai.list_models():
    print(model.name)
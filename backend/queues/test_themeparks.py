import requests
import json
from pprint import pprint

def main():
    efteling_id = "30713cf6-69a9-47c9-a505-52bb965f01be"
    url = f"https://api.themeparks.wiki/v1/entity/{efteling_id}/live"
    
    response = requests.get(url)
    data = response.json()
    
    # Pretty print the data for better readability
    pprint(data)
    
    # Save to a JSON file for inspection
    with open('efteling_data.json', 'w') as f:
        json.dump(data, f, indent=2)

if __name__ == "__main__":
    main() 
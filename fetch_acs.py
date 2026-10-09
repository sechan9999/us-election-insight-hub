import os, requests, pandas as pd
os.makedirs("data", exist_ok=True)
KEY = "7315a2b73a94d4085f5478e399c19b2b85637080"
vars = "NAME,B01003_001E,B19013_001E,B15003_022E"
url = f"https://api.census.gov/data/2022/acs/acs5?get={vars}&for=county:*&in=state:*&key={KEY}"
rows = requests.get(url).json()
acs = pd.DataFrame(rows[1:], columns=rows[0])
acs["fips"] = acs["state"] + acs["county"]
for c in ["B01003_001E","B19013_001E","B15003_022E"]:
    acs[c] = pd.to_numeric(acs[c], errors="coerce")
acs = acs.rename(columns={"B01003_001E":"pop","B19013_001E":"median_income","B15003_022E":"bachelors"})
acs.to_csv("data/acs_county_2022.csv", index=False)
print(acs.shape, "saved -> data/acs_county_2022.csv")
print(acs.head())
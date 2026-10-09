import pandas as pd, json, plotly.express as px
from urllib.request import urlopen
import os

os.makedirs("public", exist_ok=True)
with urlopen("https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json") as r:
    counties = json.load(r)

m = pd.read_csv("data/merged_2024_acs.csv", dtype={"county_fips": str})
m["county_fips"] = m["county_fips"].str.zfill(5)

fig = px.choropleth(
    m, geojson=counties, locations="county_fips", color="dem_share",
    color_continuous_scale="RdBu", range_color=(0.2, 0.8), scope="usa",
    labels={"dem_share": "Dem vote share"},
    hover_data=["NAME", "total", "median_income", "bachelors_pct"],
)
fig.update_layout(title_text="2024 county Democratic vote share", margin=dict(l=0, r=0, t=40, b=0))
fig.write_html("public/map_2024.html")
print("saved -> public/map_2024.html")
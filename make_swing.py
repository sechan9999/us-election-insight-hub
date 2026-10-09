import pandas as pd, json, glob, os
import plotly.express as px
from urllib.request import urlopen

path = glob.glob("data/countypres*")[0]
sep = "\t" if open(path, encoding="utf-8").readline().count("\t") > 2 else ","
df = pd.read_csv(path, dtype=str, sep=sep)
df = df[df.office == "US PRESIDENT"].copy()
df["county_fips"] = df["county_fips"].str.zfill(5)
df["candidatevotes"] = pd.to_numeric(df["candidatevotes"], errors="coerce").fillna(0)

def dem_share(year):
    d = df[df.year == year]
    tot = d.groupby("county_fips")["candidatevotes"].sum()
    dem = d[d.party == "DEMOCRAT"].groupby("county_fips")["candidatevotes"].sum()
    return (dem / tot).rename(f"dem_{year}")

sw = pd.concat([dem_share("2020"), dem_share("2024")], axis=1).dropna().reset_index()
sw["swing"] = sw["dem_2024"] - sw["dem_2020"]      # + = 민주 쪽, - = 공화 쪽
sw.to_csv("data/swing_2020_2024.csv", index=False)

with urlopen("https://raw.githubusercontent.com/plotly/datasets/master/geojson-counties-fips.json") as r:
    counties = json.load(r)
fig = px.choropleth(sw, geojson=counties, locations="county_fips", color="swing",
    color_continuous_scale="RdBu", color_continuous_midpoint=0, range_color=(-0.1, 0.1),
    scope="usa", labels={"swing": "Dem swing 20→24"}, hover_data=["dem_2020", "dem_2024"])
fig.update_layout(title_text="County shift in Democratic vote share, 2020 → 2024",
                  margin=dict(l=0, r=0, t=40, b=0))
os.makedirs("public", exist_ok=True)
fig.write_html("public/swing_map.html")
print("saved -> public/swing_map.html | counties:", len(sw), "| mean swing:", round(sw.swing.mean(), 4))
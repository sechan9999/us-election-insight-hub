import pandas as pd, glob

YEAR = "2024"

cands = glob.glob("data/countypres*")
if not cands:
    raise SystemExit("data/ 폴더에 countypres 파일을 넣으세요")
path = cands[0]
print("using:", path)
sep = "\t" if open(path, encoding="utf-8").readline().count("\t") > 2 else ","
res = pd.read_csv(path, dtype=str, sep=sep)

res = res[(res.year == YEAR) & (res.office == "US PRESIDENT")].copy()
print(f"{YEAR} president rows:", len(res))
res["county_fips"] = res["county_fips"].str.zfill(5)
res["candidatevotes"] = pd.to_numeric(res["candidatevotes"], errors="coerce").fillna(0)

tot = res.groupby("county_fips")["candidatevotes"].sum().rename("total").reset_index()
piv = res.groupby(["county_fips", "party"])["candidatevotes"].sum().unstack(fill_value=0).reset_index()
piv = piv.merge(tot, on="county_fips")
piv["dem_share"] = piv.get("DEMOCRAT", 0) / piv["total"]
piv["rep_share"] = piv.get("REPUBLICAN", 0) / piv["total"]

acs = pd.read_csv("data/acs_county_2022.csv", dtype={"fips": str})
acs["bachelors_pct"] = acs["bachelors"] / acs["pop"]

m = piv.merge(acs, left_on="county_fips", right_on="fips", how="inner")
m.to_csv(f"data/merged_{YEAR}_acs.csv", index=False)

print("merged counties:", len(m))
print(m[["dem_share", "rep_share", "median_income", "bachelors_pct"]].corr().round(3))
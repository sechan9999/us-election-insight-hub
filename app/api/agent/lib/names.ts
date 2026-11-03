// English renderings of Korean proper names, shared by the agent route
// (answer prose) and the agent tab (tool-trace summaries). Family name
// first, given name joined, matching the romanization already used in the
// UI's tally-sheet caption (Lee Jaemyung, Kim Moonsoo, ...). Tool-trace
// JSON itself keeps the original Korean values: it is raw evidence, and
// translating it would break fidelity with the tool output.

export const CANDIDATE_EN: Record<string, string> = {
  이재명: "Lee Jaemyung", 김문수: "Kim Moonsoo", 이준석: "Lee Junseok",
  권영국: "Kwon Youngkuk", 송진호: "Song Jinho",
  박근혜: "Park Geunhye", 문재인: "Moon Jaein", 강지원: "Kang Jiwon",
  김순자: "Kim Soonja", 김소연: "Kim Soyeon", 박종선: "Park Jongseon",
  홍준표: "Hong Joonpyo", 안철수: "Ahn Cheolsoo", 유승민: "Yoo Seungmin",
  심상정: "Sim Sangjung", 조원진: "Cho Wonjin", 김민찬: "Kim Minchan",
  김선동: "Kim Sundong", 장성민: "Jang Sungmin", 윤홍식: "Yoon Hongsik",
  이경희: "Lee Kyunghee", 이재오: "Lee Jaeoh", 오영국: "Oh Youngkuk",
  윤석열: "Yoon Sukyeol", 허경영: "Heo Kyeongyeong", 김재연: "Kim Jaeyeon",
  오준호: "Oh Junho", 이백윤: "Lee Baekyun", 김경재: "Kim Kyungjae",
  옥은호: "Ok Eunho", 김동연: "Kim Dongyeon",
};

// Full sido names as returned by the tools (see tools.ts SD normalization).
export const SIDO_EN: Record<string, string> = {
  서울특별시: "Seoul", 부산광역시: "Busan", 대구광역시: "Daegu",
  인천광역시: "Incheon", 광주광역시: "Gwangju", 대전광역시: "Daejeon",
  울산광역시: "Ulsan", 세종특별자치도: "Sejong",
  경기도: "Gyeonggi Province", 강원특별자치도: "Gangwon State",
  충청북도: "North Chungcheong Province", 충청남도: "South Chungcheong Province",
  전북특별자치도: "Jeonbuk State", 전라남도: "South Jeolla Province",
  경상북도: "North Gyeongsang Province", 경상남도: "South Gyeongsang Province",
  제주특별자치도: "Jeju Province",
};

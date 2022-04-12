import jsonData from "../Components/CPK_Colors.json";

const useColors = (protein) => {
  if (jsonData[protein]) return jsonData[protein];
  else return "not found";
};
export default useColors;

import jsonData from "../Components/CPK_Colors.json";

const useColors = (protein) => {
  //   const getByKey = (Key) => {
  //     for (let value of Object.keys(cpk)) if (cpk[protein]) return value;
  //   };

  Object.keys(jsonData).forEach(function (key) {
    var value = jsonData[protein];
    // ...
    return value;
  });
};

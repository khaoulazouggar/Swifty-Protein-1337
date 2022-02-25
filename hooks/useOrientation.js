import { useState, useEffect } from "react";
import { Dimensions } from "react-native";

const useOrientation = () => {
  const [orientation, setOrientation] = useState("portrait");
  const isPortrait = () => {
    const dim = Dimensions.get("screen");
    return dim.height >= dim.width;
  };

  useEffect(() => {
    let isMounted = true;
    const ori = isPortrait() ? "portrait" : "landscape";
    setOrientation(ori);

    Dimensions.addEventListener("change", () => {
      const ori = isPortrait() ? "portrait" : "landscape";
      if (isMounted) setOrientation(ori);
    });

    return () => {
      isMounted = false;
    };
  }, []);

  return orientation;
};

export default useOrientation;

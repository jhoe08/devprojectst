jsVectorMap.addMap("world", {
  insets: [
    {
      width: 900,
      top: 0,
      left: 0,
      height: 440.70631074413296,
      bbox: [
        { y: -12671671.123330014, x: -20004297.151525836 },
        { y: 6930392.025135122, x: 20026572.39474939 },
      ],
    },
  ],
  paths: {
    // ... other country paths ...

    // Add only region 7 of the Philippines (customize this path as needed)
    REGION_7_PH: {
      path: "M650.32,213.86l0.84,0.71l-0.12,1.1l-3.76,-0.11l-1.57,0.4l-1.93,-0.87l1.48,-1.96l1.13,-0.57l1.63,0.57l1.33,0.08l0.99,0.65Z",
      name: "Region 7 (Philippines)",
    },
  },
});

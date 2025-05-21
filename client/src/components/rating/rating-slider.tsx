import { useState } from "react";

interface RatingSliderProps {
  value: number;
  onChange: (value: number) => void;
}

export function RatingSlider({ value, onChange }: RatingSliderProps) {
  return (
    <div className="w-full">
      <input
        type="range"
        min="0"
        max="100"
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary"
      />
      <div className="flex justify-between text-xs text-gray-600 px-1 mt">
        <span className="text-xs">0</span>
        <span className="text-xs">50</span>
        <span className="text-xs">100</span>
      </div>
    </div>
  );
}

// import React, { useState } from "react";

// import { Slider } from "@/components/ui/slider"; // Make sure you import the Slider component

// interface RatingSliderProps {
//   value: number;
//   step?: number;
//   //   onSliderChange: (value: number[]) => void;
//   onChange: any;
// }

// export const RatingSlider = ({ value, step, onChange }: RatingSliderProps) => {
//   const [isDragging, setIsDragging] = useState(false);

//   /**
//    * Function to prevent the slider from going out of bounds
//    * @param value - The current value of the slider
//    */

//   const getClampedOffset = (value: number) => {
//     if (value < 5) return "5%";
//     if (value > 95) return "90%";
//     return `${value}%`;
//   };

//   return (
//     <div className="flex flex-col gap-2">
//       <div className="relative">
//         {/* Custom track */}
//         <div className="absolute inset-y-0 left-0 right-0 flex items-center z-0">
//           <div className="w-full h-2 bg-gray-200 rounded-full relative">
//             <div
//               className="absolute top-0 left-0 h-2 bg-surface-brand rounded-full"
//               style={{ width: `${value}%` }}
//             ></div>
//           </div>
//         </div>

//         {/* Actual Slider */}
//         <Slider
//           value={[value]}
//           min={0}
//           max={100}
//           step={step}
//           onValueChange={onChange}
//           onPointerDown={() => setIsDragging(true)}
//           onPointerUp={() => setIsDragging(false)}
//           className="relative z-10"
//         />
//       </div>

//       {/* Slider labels */}
//       <div className="relative mt-2 w-full">
//         {/* Container matching slider width */}
//         <div className="relative w-full h-4">
//           <span className="absolute left-0 text-xs text-text-secondary font-medium">
//             0
//           </span>

//           {/* Moving label */}
//           <span
//             className={`absolute transition-all duration-200 font-semibold ${
//               isDragging
//                 ? "bg-surface-dark text-white px-2 py-1 text-xs rounded-full after:content-[''] after:absolute after:bottom-full after:left-1/2 after:-translate-x-1/2 after:border-4 after:border-b-surface-dark after:border-transparent"
//                 : "text-xs text-text-primary"
//             }`}
//             style={{
//               // left: `${value}%`,
//               left: getClampedOffset(value),
//               transform: "translateX(-50%)",
//               whiteSpace: "nowrap",
//             }}
//           >
//             {value}
//           </span>

//           <span className="absolute right-0 text-xs text-text-secondary font-medium">
//             100
//           </span>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default RatingSlider;

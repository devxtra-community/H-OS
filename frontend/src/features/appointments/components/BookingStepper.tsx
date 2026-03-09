'use client';

interface Props {
  step: number;
}

const steps = [
  "Select Date",
  "Choose Department",
  "Select Doctor",
  "Pick Time Slot"
];

export default function BookingStepper({ step }: Props) {

  return (

    <div className="w-full mb-10">

      <div className="flex items-center justify-between relative">

        {/* Background line */}
        <div className="absolute top-4 left-0 right-0 h-0.5 bg-slate-200" />

        {steps.map((label, index) => {

          const stepNumber = index + 1;
          const active = step >= stepNumber;

          return (

            <div
              key={label}
              className="relative flex flex-col items-center flex-1"
            >

              <div
                className={`z-10 h-8 w-8 rounded-full flex items-center justify-center text-sm font-semibold
                ${active
                  ? 'bg-blue-600 text-white'
                  : 'bg-slate-200 text-slate-500'
                }`}
              >
                {stepNumber}
              </div>

              <p className="text-xs mt-2 text-slate-500 text-center">
                {label}
              </p>

            </div>

          );

        })}

      </div>

    </div>

  );

}
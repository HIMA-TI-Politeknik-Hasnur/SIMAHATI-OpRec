import './ProgressStep.css';

interface Step {
  label: string;
}

interface ProgressStepProps {
  steps: Step[];
  currentStep: number; // 0-indexed
}

export const ProgressStep = ({ steps, currentStep }: ProgressStepProps) => (
  <div className="progress-step-wrapper" role="navigation" aria-label="Langkah pendaftaran">
    {steps.map((step, index) => {
      const isDone    = index < currentStep;
      const isActive  = index === currentStep;

      return (
        <div key={index} className="progress-step-item">
          {/* Connector line (kiri) */}
          {index > 0 && (
            <div className={`progress-step-line ${isDone || isActive ? 'progress-step-line--done' : ''}`} />
          )}

          {/* Lingkaran step */}
          <div
            className={[
              'progress-step-circle',
              isDone   ? 'progress-step-circle--done'   : '',
              isActive ? 'progress-step-circle--active' : '',
            ].join(' ')}
            aria-current={isActive ? 'step' : undefined}
          >
            {isDone ? '✓' : index + 1}
          </div>

          {/* Label */}
          <span
            className={[
              'progress-step-label',
              isDone   ? 'progress-step-label--done'   : '',
              isActive ? 'progress-step-label--active' : '',
            ].join(' ')}
          >
            {step.label}
          </span>
        </div>
      );
    })}
  </div>
);

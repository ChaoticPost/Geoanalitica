import { forwardRef } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';

interface MotionWrapperProps extends HTMLMotionProps<"div"> {
    children: React.ReactNode;
}

export const MotionWrapper = forwardRef<HTMLDivElement, MotionWrapperProps>(
    ({ children, ...props }, ref) => {
        return (
            <motion.div ref={ref} {...props}>
                {children}
            </motion.div>
        );
    }
);

MotionWrapper.displayName = 'MotionWrapper'; 
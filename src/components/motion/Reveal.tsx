import { motion, type HTMLMotionProps, type Variants } from "motion/react";
import * as React from "react";

const baseVariants: Variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number = 0) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.55,
      ease: [0.16, 1, 0.3, 1],
      delay: i * 0.06,
    },
  }),
};

interface RevealProps extends HTMLMotionProps<"div"> {
  delay?: number;
  as?: keyof typeof motion;
  once?: boolean;
  amount?: number;
}

export function Reveal({
  children,
  delay = 0,
  className,
  once = true,
  amount = 0.2,
  ...rest
}: RevealProps) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
      variants={baseVariants}
      custom={delay}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

export function StaggerGroup({
  children,
  className,
  stagger = 0.07,
  delayChildren = 0,
  once = true,
  amount = 0.15,
  ...rest
}: HTMLMotionProps<"div"> & {
  stagger?: number;
  delayChildren?: number;
  once?: boolean;
  amount?: number;
}) {
  const container: Variants = {
    hidden: {},
    visible: {
      transition: { staggerChildren: stagger, delayChildren },
    },
  };
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={{ once, amount, margin: "0px 0px -10% 0px" }}
      variants={container}
      {...rest}
    >
      {children}
    </motion.div>
  );
}

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 14 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] },
  },
};

export function StaggerItem({
  children,
  className,
  as: Component = "div",
  ...rest
}: React.HTMLAttributes<HTMLElement> & { as?: any }) {
  const Mot = motion(Component);
  return (
    <Mot className={className} variants={itemVariants} {...(rest as any)}>
      {children}
    </Mot>
  );
}

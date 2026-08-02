"use client";

import Link from "next/link";
import { motion, useReducedMotion } from "motion/react";

export function HeroMedia() {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="mt-10 max-w-xl"
      initial={reduceMotion ? false : { opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: reduceMotion ? 0 : 0.3 }}
    >
      <p className="text-bg/85">
        A travel journal by Ray. Slow mornings, long drives, and the places worth going back to.
      </p>
      <Link
        href="#feed"
        className="mt-6 inline-flex items-center rounded-full bg-orange px-6 py-3 text-sm font-semibold text-white shadow-[0_12px_30px_rgba(232,112,58,0.3)] transition hover:-translate-y-px focus-visible:outline focus-visible:outline-2 focus-visible:outline-orange"
      >
        Browse recent days
      </Link>
    </motion.div>
  );
}

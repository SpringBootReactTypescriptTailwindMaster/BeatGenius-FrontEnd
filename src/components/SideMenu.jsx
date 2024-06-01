import { useRef, useEffect, useState, useContext } from "react";
import { motion } from "framer-motion";
import { SidemenuContext, SidemenuProvider } from "./SidemenuContext";

const sidebar = {
  open: (height = 1000) => ({
    clipPath: `circle(${height * 2 + 200}px at 40px 40px)`,
    transition: {
      type: "spring",
      stiffness: 20,
      restDelta: 2,
      duration: 0.3, // Ajoutez une durée de transition de 300ms
    },
  }),
  closed: {
    clipPath: "circle(30px at 40px 40px)",
    transition: {
      delay: 0, // Supprimez le délai
      type: "spring",
      stiffness: 400,
      damping: 40,
      duration: 0, // Définissez la durée à 0 pour une transition instantanée
    },
  },
};

const Path = (props) => (
  <motion.path
    fill="transparent"
    strokeWidth="3"
    stroke="hsl(0, 0%, 18%)"
    strokeLinecap="round"
    {...props}
  />
);

const MenuToggle = ({ toggle }) => (
  <button
    onClick={toggle}
    className="btn btn-ghost btn-circle absolute top-4 left-4"
  >
    <svg width="23" height="23" viewBox="0 0 23 23">
      <Path
        variants={{
          closed: { d: "M 2 2.5 L 20 2.5" },
          open: { d: "M 3 16.5 L 17 2.5" },
        }}
      />
      <Path
        d="M 2 9.423 L 20 9.423"
        variants={{
          closed: { opacity: 1 },
          open: { opacity: 0 },
        }}
        transition={{ duration: 0.1 }}
      />
      <Path
        variants={{
          closed: { d: "M 2 16.346 L 20 16.346" },
          open: { d: "M 3 2.5 L 17 16.346" },
        }}
      />
    </svg>
  </button>
);

const itemVariants = {
  open: {
    y: 0,
    opacity: 1,
    display: '',
    transition: {
      y: { stiffness: 1000, velocity: -100 },
    },
  },
  closed: {
    y: 50,
    opacity: 0,
    display: 'none',
    transition: {
      y: { stiffness: 1000 },
    },
  },
};

const MenuItem = () => {
  const [isLoginIn, setIsLoginIn] = useState(false);
  const { isOpen } = useContext(SidemenuContext);

  useEffect(() => {
    if (localStorage.getItem("authToken")) {
      setIsLoginIn(true);
    }
  }, []);

  return (
    <>
      {!isLoginIn && (
        <>
          <motion.li
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/login">
              Se Connecter
            </a>
          </motion.li>
          <motion.li
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/inscription">
              Inscription
            </a>
          </motion.li>
        </>
      )}
      {isLoginIn && (
        <>
          <motion.li
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/">
              Page d'acceuil
            </a>
          </motion.li>
          <motion.li
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/instrumentales">
              Mes Intrumentales
            </a>
          </motion.li>
          <motion.li
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/catalogue">
              Mes Catalogues
            </a>
          </motion.li>
          <motion.li
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/modifier-profile">
              Modifier Votre Profile
            </a>
          </motion.li>
          <motion.li
            variants={itemVariants}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            <a href="/logout">
              Se Déconnecter
            </a>
          </motion.li>
        </>
      )}
    </>
  );
};

const variants = {
  open: {
    transition: {
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  closed: {
    transition: {
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
};

const Navigation = () => (
  <motion.ul variants={variants} className="absolute top-20 w-64 px-6">
    <MenuItem />
  </motion.ul>
);

const useDimensions = (ref) => {
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    dimensions.current.width = ref.current.offsetWidth;
    dimensions.current.height = ref.current.offsetHeight;
  }, []);

  return dimensions.current;
};

const Sidemenu = () => {
    const containerRef = useRef(null);
    const { height } = useDimensions(containerRef);
    const { isOpen, toggleOpen } = useContext(SidemenuContext); // Utilisez le contexte directement

  return (
    <SidemenuProvider value={{ isOpen, toggleOpen }}>
      <motion.nav
        initial={false}
        animate={isOpen ? "open" : "closed"}
        custom={height}
        ref={containerRef}
      >
        <motion.div
          className="fixed top-0 left-0 bottom-0 w-72 bg-base-100"
          variants={sidebar}
        />
        <Navigation />
        <MenuToggle toggle={() => toggleOpen()} />
      </motion.nav>
    </SidemenuProvider>
  );
};

export default Sidemenu;

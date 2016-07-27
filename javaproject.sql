-- phpMyAdmin SQL Dump
-- version 4.1.14
-- http://www.phpmyadmin.net
--
-- Client :  127.0.0.1
-- Généré le :  Jeu 09 Avril 2015 à 18:12
-- Version du serveur :  5.6.17
-- Version de PHP :  5.5.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- Base de données :  `javaproject`
--

-- --------------------------------------------------------

--
-- Structure de la table `ligne`
--

CREATE TABLE IF NOT EXISTS `ligne` (
  `idLigne` int(11) NOT NULL AUTO_INCREMENT,
  `idMasque` int(11) NOT NULL,
  `position` int(11) NOT NULL,
  `idStyle` int(11) NOT NULL,
  `libelle` varchar(100) NOT NULL,
  `contexte` text NOT NULL,
  PRIMARY KEY (`idLigne`),
  KEY `idStyle` (`idStyle`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=9 ;

--
-- Contenu de la table `ligne`
--

INSERT INTO `ligne` (`idLigne`, `idMasque`, `position`, `idStyle`, `libelle`, `contexte`) VALUES
(1, 1, 1, 1, 'Volume bétons normal', '{\r\n"dimensions" :\r\n["B100_CC",\r\n"kU",\r\n"S01"]\r\n}\r\n'),
(7, 7, 1, 3, 'Volume bétons normal2', '{"dimensions" :["B100_CC","kU","S01"]}'),
(8, 7, 2, 3, 'Volume bétons normal3', '{"dimensions" :["B100_CC","kU","S01"]}');

-- --------------------------------------------------------

--
-- Structure de la table `masque`
--

CREATE TABLE IF NOT EXISTS `masque` (
  `idMasque` int(11) NOT NULL AUTO_INCREMENT,
  `nomMasque` varchar(100) NOT NULL,
  `contexteWeb` text NOT NULL,
  `contexteLigne` text NOT NULL,
  `contexteColonne` text NOT NULL,
  `cubeAssocie` varchar(20) NOT NULL,
  `derniereModification` date NOT NULL,
  `auteur` varchar(100) NOT NULL,
  `dernierEditeur` varchar(100) NOT NULL,
  PRIMARY KEY (`idMasque`),
  UNIQUE KEY `nameUnique` (`nomMasque`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- Contenu de la table `masque`
--

INSERT INTO `masque` (`idMasque`, `nomMasque`, `contexteWeb`, `contexteLigne`, `contexteColonne`, `cubeAssocie`, `derniereModification`, `auteur`, `dernierEditeur`) VALUES
(1, 'masque_test', '{\n"input":["Site","Budget","Societe","View","Time Periods"],\n"display":["Organisation","Societe"]\n}', '{\n"dimensions" :\n["CostCenter",\n"Measure",\n"Account"]\n}\n', '{\n"dimensions" :\n["Site",\n"Societe",\n"View",\n"Budget",\n"Activity",\n"Time Periods"]\n}\n', 'Galileo', '2015-04-08', 'Marouane TALBI', 'Marouane TALBI'),
(7, 'nouveauMasque', '{"input":["Site2","Budget2","Societe2","View2","Time Periods2"],"display":["Organisation2","Societe2"]}', '{"dimensions" : ["CostCenter","Measure", "Account"]}', '{"dimensions" :["Site","Societe","View","Budget","Activity","Time Periods"]}', 'Galileo', '2015-04-09', 'Marouane', 'Marouane'),
(10, 'nouveauMasque2', '{"input":["Site2","Budget2","Societe2","View2","Time Periods2"],"display":["Organisation2","Societe2"]}', '{"dimensions" : ["CostCenter","Measure", "Account"]}', '{"dimensions" :["Site","Societe","View","Budget","Activity","Time Periods"]}', 'Galileo', '2015-04-09', 'Marouane', 'Marouane');

-- --------------------------------------------------------

--
-- Structure de la table `style`
--

CREATE TABLE IF NOT EXISTS `style` (
  `idStyle` int(11) NOT NULL AUTO_INCREMENT,
  `nomStyle` varchar(20) NOT NULL,
  `selector` varchar(100) NOT NULL,
  PRIMARY KEY (`idStyle`),
  UNIQUE KEY `nomStyle` (`nomStyle`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=7 ;

--
-- Contenu de la table `style`
--

INSERT INTO `style` (`idStyle`, `nomStyle`, `selector`) VALUES
(1, 'gras', '\\\\ficherStyle1.css'),
(2, 'italique', '\\\\fichierStyle2.css'),
(3, 'nouveauStyle', 'nouvelleFeuilleDeStyle'),
(5, 'nouveauStyle2', 'nouvelleFeuilleDeStyle2'),
(6, 'nouveauStyle3', 'nouvelleFeuilleDeStyle3');

-- --------------------------------------------------------

--
-- Structure de la table `utilisateur`
--

CREATE TABLE IF NOT EXISTS `utilisateur` (
  `idUtilisateur` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `nomUtilisateur` varchar(50) CHARACTER SET latin1 NOT NULL,
  `prenomUtilisateur` varchar(50) CHARACTER SET latin1 NOT NULL,
  `email` varchar(50) CHARACTER SET latin1 NOT NULL,
  `tel` int(10) NOT NULL,
  `colonne` text CHARACTER SET latin1 NOT NULL,
  PRIMARY KEY (`idUtilisateur`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- Contenu de la table `utilisateur`
--

INSERT INTO `utilisateur` (`idUtilisateur`, `nomUtilisateur`, `prenomUtilisateur`, `email`, `tel`, `colonne`) VALUES
(5, 'TALBIOne', 'Marouane', 'marouane@coucou.com', 888, '{Account}'),
(6, 'lol', 'lol', 'lol@lol.com', 888, '{CC}'),
(7, 'titi', 'titi', 'titi@titi.com', 888, '{Org}'),
(8, 'toto', 'toto', 'toto@toto.co', 2899, '{SiteType}'),
(10, 'cool', 'leo', 'cool@', 88900, '{Test}'),
(11, 'cotes', 'cotes', 'cotes@cotes.com', 11145, '{"Dimension":[{"Account":COI},{"CostCenter":30_CC}]}');

--
-- Contraintes pour les tables exportées
--

--
-- Contraintes pour la table `ligne`
--
ALTER TABLE `ligne`
  ADD CONSTRAINT `ligne_ibfk_1` FOREIGN KEY (`idStyle`) REFERENCES `style` (`idStyle`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `ligne_ibfk_2` FOREIGN KEY (`idMasque`) REFERENCES `masque` (`idMasque`) ON DELETE CASCADE ON UPDATE CASCADE;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;

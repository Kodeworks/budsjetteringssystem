import React from 'react';
import { Link } from 'react-router-dom';
import Heading from './molecules/atoms/Heading';

const Homepage: React.FC = () => (
  <>
    <Heading>FAQ</Heading>
    <Link to="/">Welcome to the jungle</Link>
  </>
);

export default Homepage;

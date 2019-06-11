import React from 'react';
import { Link } from 'react-router-dom';
import Heading from './molecules/atoms/Heading';

const Homepage: React.FC = () => (
  <>
    <Heading>Welcome to Liquidator</Heading>
    <Link to="/faq">Welcome to the jungle</Link>
  </>
);

export default Homepage;

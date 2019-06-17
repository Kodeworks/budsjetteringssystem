import React from 'react';
import { Link } from 'react-router-dom';

const Homepage: React.FC = () => (
  <>
    <h1>Dashboard</h1>
    <Link to="/faq">Welcome to the jungle</Link>

    <br/>
    <br/>

    <ul>
      <li>Sit aliquam sit sunt incidunt culpa Libero incidunt excepturi sequi?</li>
      <li>Ipsum ullam cupiditate quo adipisci quasi velit neque, illum Consequatur.</li>
      <li>Lorem dolor repellendus vel quaerat officia quam harum quo. Quas.</li>
      <li>Ipsum rem possimus ab harum id Quibusdam quod atque a</li>
      <li>Dolor doloremque alias at qui libero. Suscipit accusantium illum iste?</li>
    </ul>

    <br/>
    <br/>

    <img src="https://placehold.it/400x400" alt="" />

  </>
);

export default Homepage;

import React from 'react';
import { withRouter } from 'react-router';
import { Link, Route, Router, Switch, useParams } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { render, fireEvent } from '@testing-library/react';

const Home = () => <h1>Home page</h1>;
const About = () => <h1>About page</h1>;
const Error = () => <h1>Error page</h1>;

const Contact = () => {
  const { name } = useParams();
  return <h1 data-testid="contact-name">{name}</h1>;
};

const LocationDisplay = withRouter(({ location }) => (
  <div data-testid="location-display">{location.pathname}</div>
));

const NAME = 'John Doe';
const RouterComponent = () => (
  <>
    <nav data-testid="navbar">
      <Link data-testid="home-link" to="/">
        Home
      </Link>
      <Link data-testid="about-link" to="/about">
        About
      </Link>
      <Link data-testid="contact-link" to={`/contact/${NAME}`}>
        Contact
      </Link>
    </nav>

    <Switch>
      <Route exact path="/" component={Home} />
      <Route path="/about" component={About} />
      <Route path="/contact:name" component={Contact} />
      <Route component={Error} />
    </Switch>

    <LocationDisplay />
  </>
);

const renderWithRouter = (
  component,
  {
    route = "/",
    history = createMemoryHistory({ initialEntries: [route] }),
  } = {}
) => {
  const Wrapper = ({ children }) => (
    <Router history={history}>{children}</Router>
  );
  return {
    ...render(component, { wrapper: Wrapper }),
    history,
  };
};

describe('React router', () => {
  it('should render home page', () => {
    // const history = createMemoryHistory();
    // const { container, getByTestId } = render(
    //   <Router history={history}>
    //     <RouterComponent />
    //   </Router>
    // );
    const { container, getByTestId } = renderWithRouter(<RouterComponent />);
    const navbar = getByTestId('navbar');
    const link = getByTestId('home-link');
    expect(container.innerHTML).toMatch('Home page');
    expect(navbar).toContainElement(link);
  });

  it('should render navigate page', () => {
    // const history = createMemoryHistory();
    // const { container, getByTestId } = render(
    //   <Router history={history}>
    //     <RouterComponent />
    //   </Router>
    // );
    const { container, getByTestId } = renderWithRouter(<RouterComponent />);
    fireEvent.click(getByTestId('contact-link'));
    expect(container.innerHTML).toMatch('John Doe');
  });

  it('should navigate to error page if route is wrong', () => {
    // const history = createMemoryHistory();
    // history.push('wrong-route');
    // const { container } = render(
    //   <Router history={history}>
    //     <RouterComponent />
    //   </Router>
    // );
    const { container } = renderWithRouter(<RouterComponent />, {
      route: 'wrong-route',
    });
    expect(container.innerHTML).toMatch('Error page');
  });

  it('rendering a component that use withRouter', () => {
    // const history = createMemoryHistory();
    // const route = '/some-route';
    // history.push(route);
    // const { getByTestId } = render(
    //   <Router history={history}>
    //     <RouterComponent />
    //   </Router>
    // );
    const { getByTestId } = renderWithRouter(<RouterComponent />, {
      route: 'wrong-route',
    });

    expect(getByTestId('location-display')).toHaveTextContent('wrong-route');
  });
})
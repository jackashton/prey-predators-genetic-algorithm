# prey-predators-genetic-algorithm

Genetic algorithm which simulates natural selection and genetic diversity in a competitive environment with limited resources.

(Predators are blue and prey are stationary green circles)

#### Predators Attributes:
  - A limited amount of energy - this determines how far they can travel before dying. 
  - Sensory distance - indicated by the black ring, this is the distance that they can detect prey or obstacles in the enviornment.
  - Velocity - indicated by the black line, direction indicates movement direction and length indicates speed.

#### The simulations works as follows:
  - If a predator eats one prey and returns to the edge of the map it survies to the next generation.
  - If a predator eats two prey and returns to the edge of the map it survives and reproduces one offspring with a chance of mutation.

The mutations can be either increased speed, or increased sensory distance. 

Each attribute has an associated cost curve which determines the cost of movement in the world, speed has a higher cost rate than sensory distance so investing in speed is expensive and more risky. 

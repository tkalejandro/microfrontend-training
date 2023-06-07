# microfrontend-training
Selftraining notes

# Section 1

## Understanding a Microfrontend

What needs to be understand is when we are building a Project with microfrontend we will need the Number of MiniApps  +  Container project. The container is the one who will take each part of the project and unify them. This is called "Integration".

## Type of integration

### Build Time Integration

- In a nutshell is like generating npm packages. one team send app1 as npm package and then the other team download it and publish their app2. 
- The problem with this, everytime app1 is updated , app2 needs to be redeploy again (app2 is the container).

### Run Time Integration

- Updates are deployed independently.
- When container app is loaded, it will fetch the information from app1. Biggest advantage.
- Is really hard to setup.

### Server Integration
- Server makes the decision of what content to load. 
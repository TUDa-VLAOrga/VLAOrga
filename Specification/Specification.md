# Specification for VLAOrga
## Project Description (about 500 words)

The project VLAOrga is part of a practical lecture held at the Technical University in Darmstadt that aims at improving existing university systems or constructing new solutions.

### Domain

The "Vorlesungsassistenz Physik", which will from now on be abbreviated to VLA, of the physical department at TU Darmstadt is an essential part of ensuring that various physics based lectures can be held properly by ensuring that experiments are prepared before the lecture takes place.

This very taks requires a lot of planning as a lectures do not have the time to prepare those experiments and one lecture might even contain multiple experiments.

For this purpose the VLA already has established a manual system in which they arrange themselves in a way that enables lecturers to receive their wished for experiments after requesting that very experiment via https://linus.iap.physik.tu-darmstadt.de/

For the VLA some dependencies on certain HRZ services i.e. the Ticketing system, Mails, etc. have proven to be unconvenient at times and are, as of now, a bottleneck for a seemless working environment.

### Current State
 
Following a prior project that allowed the VLA to store and manage information about their experiments within a data base via the aforementioned linus (see link above), the VLA requested us to further simplfy the process of organizing the deployment of experiments as well as reducing uncertainties that may arise due to natural miscommunication or analog on-the-fly communication.

As of now a large chunk of organizational communication is done using this very blackboard, printed mediums and hand-written notes. 
[Image of Blackboard]

Furthermore, the VLA is, as of now, greatly hindered from doing their work efficiently as electronic mails are distributed on a per person basis instead of one central instance. This causes further effort in communicating what already has been worked on and what has not even been read yet making room for misinterpretations and errors. 

### Vision

With this project we aim at tackling those organizational bottlenecks by creating an easy to setup and maintaintable web application that can be used to greatly lessen miscommunication and improve on the VLA workflow for years to come.

An easy to use digital overview in the form of a central calendar with clickable lecture experiment overviews should replace the necessity for hand-written notes and printed out timetables. 

This calendar will not only serve its purpose in clearly displaying the different dates in a unified and easy to read format, it will also greatly lessen the possibility for further misscommunication between members of the VLA as everyone with appropriate access to the calendar will be able to see the latest modifications and an up-to-date view of the current organizational status using their phone.

The workflow of the VLA will also benefit from many quality of life improvements that will not only increase efficiency, but make certain tasks such as checking the current state of an specific experiment material or moving certain experiments between lectures much less of a hassle.

### Diagram of architecture

[Diagram of Architecture]

## Deliverables (currently 482 words)

VLAOrga will be developed as a fully fledged web server.
This includes the client being able to interact with the program via the responsive frontend that can be viewed using any modern browser. 
The main processing and synchronisation will happen in the backend, a part of our software that will handle most of our program logic. This backend will run on a server like the Synology NAS of the VLA but is in general not limited by the used server as long as it meets the minimum requirements..

The backend will be compatible with any modern operating system with a reliabel internet connection due to the usage of the de-facto containerization standard Docker.

Developement of the frontend will use well established tools like React and TypeScript.
The backend will be written in Spring Boot, a Java Framework, allowing for object oriented programming and with it many the advantage to define clear module interfaces.

As discussed an agreed upon with the VLA, the development and documentation of this software will be found on GitHub (https://github.com/TUDa-VLAOrga/VLAOrga).

GitHub will also be used as a the primary platform for project communication. 
This includes, among other things, the "Issues" tab where any interested person can see the current planning state of the project e.g which features are targeted in a given iteration and much more.

Most of the implemented features will be tested thoroughly, especially the core functionality. 
The test will happen at least on unit and integration level.
This does explicitly not mean that we are aming for 100% test coverage as we prioritize the quality of tests over the quanitity of tests.

During developement new feature requests will be discussed with the VLA but we cannot guarantee that all features will be implemented. If a feature should not make it into the release we will inform the VLA beforehand and discuss further prioritization in case of triages directly with the VLA.  

We hereby guarantee that core functionality will be part of the final release of this software.
This functionality can only be guaranteed when a stable internet connection is available.
The core functionalities that we have identified will be in the last part of this segment.

### Calendar
The calendar will list an overview of experiments and their due dates.

This very arrangment of experiment usage times will be displayed in a row corresponding to the day that it is taking place on.

The calendar will have an option to go forward or backward in time.

The calendar will sync to the existing data base and will display only the latest of information.

The calendar will allow clicking of lectures ensuring an overview over the experiments

### Experiments
An overview of Experiments will be accessible within the interfaces.

There will be an option to reschedule experiments.

For any given experiment that is also registered in the existing data base, the current status should be displayed.

## Risks (497 words)
In general we will focus on a quick adaption in our prioritization if any major problem were to happen. Independent of the problem at hand we will first discuss further actions within our the confines of our team and afterwards we will inform and discuss our plans with the VLA. Most importantly certain nice-to-have features will possibly be postponed to later iterations of the development cycles in favor of the core features.

A delay in core functionality cannot be ruled out and will be communicated as soon as possible.  

If the actions of a team member results in a time deficit at the time of any given iteration, we will soon inform them about their working time deficit. For that we have set up time tracking, allowing us to compare if everyone is working on their features as expected. In addition to that we will also work with certain techniques allowing a gross estimation of problem complexity.
This scenario could, for example, be caused by a long extended sickness. In such a case we will have to deal with that lost time. There is a possibility that this might happen but we do not think that will occur.

If the infrastructure of one person fails, the university provides multiple backup methods such as power, eduroam or even a borrowable laptop. If a fault like this happens we will communicate this situation to the VLA as soon as possible. This could lead to some delay and with that missing features in the future. A sudden collapse of home infrastructure is also quite unlikely, so we will not expect this circumstance.

If the E-Mail communication with the VLA suddenly comes to a halt, we will try to contact you via alternative means e.g. other mails, telephone, etc.. and communicate this to our supervisor.
As communication has proven to be great and reliable until know we do not expect to run into this problem.

If GitHub proves to be unreliable or even problematic from a reliability point of view, we will communicate our problems with the our supervisor and the VLA. We hereby allow ourself to migrate the codebase to another git hosting platform and revising the specified instances of GitHub and the according links to the project within the specification.
As GitHub has proven to be reliable over many years, we doubt that this scenario could happen. 

If one of our team members gets hacked, we will tell our supervisor and the VLA as soon as we, as a team, are informed about such an occurence. Only a part of work that was done on that local machine might be lost during process. A recovery could possibly delay our plan a bit but this should not result in any major problems.
We will make sure that safety precautions such as 2FA will be enabled on every account making such an attack quite unlikely. If it were to happen, we could recover the project within a few days at maximum. 



## Legal (approx. 118 words)

It was agreed upon that this project will be an open-source project.

We encourage you to use this software if it can help you adapt your work efficiency. 

If used outside of TU Darmstadt, we cannot guarantee that all features will work in the same extent it does there. Different environments will need adaption to different interfaces.

The ownership of the repository containing the project will not be transferred after the developement has ended.

Communication with the VLA will primarly consist of Mail exchanges and meetups. The Mails have already been exchanged and will not be listed due to privacy concerns.
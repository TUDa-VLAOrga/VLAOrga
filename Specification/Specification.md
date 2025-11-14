---
geometry: right=2cm,left=2cm,top=2cm,bottom=2c
---


# Specification for "Organisation Vorlesungsassistenz Physik"

## Project Description

The project VLAOrga is part of a practical lecture held at the Technical University of Darmstadt
which teaches agile software development by working on projects
that arise within the university.

### Domain

The "Vorlesungsassistenz Physik" of the department of physics at TU Darmstadt,
abbreviated as VLA,
is an essential part of ensuring that lectures containing demonstration experiments can be held properly. 
The VLA achieves this by preparing those experiments before these lectures take place.

Many students, lecturers and possibly future physics institutions benefit from the work of the VLA. 

The organization behind multiple lecture requests requires a lot of planning as the lecturers do not have the time to prepare those experiments themselves.   
Furthermore, a lecture might even contain multiple experiments.

For this purpose the VLA has established a semi-automatic booking system.
Lecturers may request experiments via the web application 
linus (<https://linus.iap.physik.tu-darmstadt.de/>).

The VLA processes those requests manually, prepares the needed materials and assigns someone that sets up the experiment.

Communicating with external stakeholders is also essential for the VLA. 

When lecture hall inventory, experimental equipment or comparable items
require repair, the VLA contacts various craftspeople of TU Darmstadt
by creating tickets in the according ticketing systems via Mail.
These systems are operated by the Hochschulrechenzentrum (HRZ).

Linus is also not directly maintained by the VLA but by their IT administrator.

### Current State

Following a project that allows the VLA to store and manage information about their experiments
within a database via linus, the VLA requested us to further simplify their processes regarding experiment preparation and communication.
Unreliable on-the-fly communication and miscommunication have also favored this decision.

A large chunk of organization is done using this whiteboard, printed mediums and hand-written notes.

![Current planning whiteboard of the VLA](../../hessenbox/img/vlawhiteboard-full.jpg){width=70%}

Furthermore, the VLA is hindered from doing their work efficiently
as E-Mails are distributed on a per person basis instead of one central instance.
This causes further effort in communicating what already has been worked on and what is still unread,
making room for misinterpretations and errors.

### Vision

With this project we aim at tackling those organizational bottlenecks
by creating a web application.

An easy-to-use digital overview in the form of a calendar with clickable time slots
that represent certain appointments, such as planned experiments,
should replace hand-written notes and printed out timetables.

This calendar will not only serve its purpose in clearly displaying different appointments in a unified and easy-to-read format.
It will also greatly lessen the possibility for miscommunication between members of the VLA and improve upon the current workflow.
Anyone with access to the calendar will be able to see the latest modifications
and an up-to-date view of the current organizational status on their device.

The VLA will also benefit from many quality-of-life improvements that will not only increase efficiency,
but streamline tasks such as checking the current state of a specific experiment component
or moving experiments between lectures.

Furthermore, this software should be maintainable, so that other development teams
can continue developing it. 

### Diagram of architecture

![Architecture Diagram: How our Software integrates into existing services](../../hessenbox/img/architecture-diagram-v2.png){width=70%}

## Deliverables

VLAOrga will be developed as a fully fledged web application.
This includes the client being able to interact with the program via our device-adapting user interface that can be viewed using any modern browser.
The main processing and synchronization will happen in the backend, a part of our software that will handle most of our program logic.
This backend will run on a server like the Synology NAS of the VLA but is in general not limited by the used server as long as it meets the minimum requirements.
Furthermore, this software will be easy to set up at TU Darmstadt 
using a guide that we'll provide near the end of our development.

The backend will be compatible with any modern operating system that has a reliable internet connection due to the usage of the containerization standard Docker.

The frontend will use well established tools like a frontend framework, e.g. React, and TypeScript.
The backend will be written in a Java Framework, e.g. Spring Boot, allowing for object oriented programming and the definition of clear module interfaces.

The development of this project will take place on GitHub and is publically accessible
via <https://github.com/TUDa-VLAOrga/VLAOrga>.
This repository will contain all of the source code as well as documentation for
anyone, especially the VLA, that is interested in setting up this project in a
production environment. 

GitHub will also be used as a the primary platform for project communication.
This includes, among other things, the "Issues" tab where any interested person can see
the current planning state of the project e.g. which features are targeted in a given iteration and much more.

Most of the implemented features will be tested thoroughly, especially the core functionality.
This does explicitly not mean that we are aiming for 100% test coverage
as we prioritize the quality of tests over the quanitity of tests.
Our testing data will either be made up by us and validated by the VLA
or will be extracted from linus directly. 

During development new feature requests will be discussed with the VLA
yet we cannot guarantee that all discussed features will be implemented.
If a feature should not make it into its scheduled release, we will inform the VLA beforehand.
In case of feature triages we'll coordinate our prioritization plan directly with the VLA.

We hereby guarantee that core functionality will be part of the final release of this software.
This functionality can only be guaranteed when a stable internet connection is available.
The core functionalities that we have identified will be listed below.

### Calendar
The calendar will visualize booked slots that are related to lectures with experiments. 
Upon clicking on such a slot, the user will receive additional information about that slot
such as the experiments that were requested for that lecture.

Time slots will be displayed in time-dependent parts of their respective day-specific column.

The calendar will have an option to go forward or backward in time.

The calendar will sync to the existing database and will display only the latest of information.

### Experiments
For any given experiment that is listed in one of the aforementioned slots, we will provide
a method of accessing additional information about that experiment.

The status of the experiment, e.g. if it has been prepared, will be viewable via the
additional information page.

There will be an option to reschedule experiments.

## Risks
In general we will focus on a quick adaption in our prioritization if any major problem were to happen.
Independent of the problem at hand we will first discuss further actions within the confines of our team.
Afterwards we will inform and discuss our plans with the VLA and our supervisor.
Most importantly certain nice-to-have features will possibly be postponed to later iterations
of the development cycles in favor of the core features.
A delay in core functionality cannot be ruled out and will be communicated as soon as possible.

Unless explicitly stated otherwise, we will follow this described procedure in every case.

If a team member does not contribute enough in an iteration,
we will soon inform them about their working deficit, unless they are excused.
For that we have set up time tracking.
In addition to that we will also work with problem complexity and time estimation techniques.
This scenario could, e.g. be caused by a long extended sickness.
There is a possibility that this might happen but we do not think that will occur.

If external interfaces, such as the endpoint to linus or the connection to third-party calendars, turn out to be unreachable or nonexistent,
we will try to find alternative solutions with the VLA, which might cause a delay.
This scenario cannot be ruled out and will, especially in the beginning, be considered
as a potential problem.

If the E-Mail communication with the VLA suddenly comes to a halt, we will try to contact you via alternative means
e.g. other mails, telephone, etc. and communicate this to our supervisor.
As communication has proven to be great and reliable until now we do not expect to run into this problem.

If GitHub proves to be unreliable,
we will communicate this as soon as possible.
We hereby allow ourself to migrate the codebase to another git hosting platform.
As GitHub has proven to be reliable over many years, we doubt that this scenario will happen.

If one of our team members gets hacked, we will communicate this scenario immediately.
Only work done on that local machine might be lost during this process.
A recovery could cause a delay but should not result in any major setbacks.
We will make sure that safety precautions are taken on every account making such an attack quite unlikely.
In such a case we could recover the project within a few days at maximum.

If our current stack of selected technologies (see Deliverables) proves to be unfitting,
we will inform our supervisor and the VLA about our migration intention.
The advantages of this switch will be carefully considered against possible delay beforehand.  
This could potentially happen, but as most of our code will work framework independent,
the expected time lost should be kept to at most a few days.

## Legal

It was agreed upon that this project will be an open-source project.

We encourage you to use this software if it can help you adapt your work efficiency.

If used outside of TU Darmstadt, we cannot guarantee that all features will work in the same extent they do there.
This software will provide interfaces that are mainly geared towards
the applications of the VLA.
Adapting this system to your individual needs will probably need certain
modifications in our code base or even new modules that can interface with our existing software.
Again, we do not guarantee that this will be a seamless plug-and-play solution for other organizations.

Communication with the VLA will primarly consist of Mail exchanges and meetups.
14/09/2013.
	The github is created.
14/09/2013 23.53.
	Getting used to github. Cloning git repository from github.
17/09/2013 18.06.

    This project will be do as an evolve project, from some easy steps, with basic definitions of the final project, to more
    complex steps where the hardest complexity will be included. 

    The first step has been started. In this step it must be specified the JSON file structure, as well
    some kind of method or function able to create and read the JSON structures. In this first step, an easy example
    able to show at least different types of graphs will be done. To draw graphs, it will be used a graphical library called
    Flotr2 (http://www.humblesoftware.com/flotr2/documentation#introduction). 
    
    The information to draw a graph will be obtained from a JSON file (to make it easy, the JSON file will be stored locally.
    In other steps, to add more complexity, the data can be obtained from an AJAX call which return the JSON structure).

    The JSON structure which will be used in this project will contain the type(area, lines, bars, ..) of the graph.Furthermore,
    it will also containt the data of the graph that is going to be shown. An example of the structure can be something like
    {"type":"area",
        "data":[{'x':'0','y':'0'},
            {'x':'1','y':'1'},
            {'x':'2','y':'2'},
            {'x':'3','y':'3'},
            {'x':'4','y':'4'}]
    }
    
19/09/2013 17.35

    Last day I started writing the documentation for first step. Today I'm going to finish the firstStep.html file where all the code
    for the previous documentation will be executed.
    In the end, today I have not finished the first step. Today I have done a simple example of the flotr2 library. I think that can be a
    good idea to create some kine of 'anexo' just destinated to documentate the different options for this library.
    
23/09/2013 10.33

	From last days, it have been seen that it's possible to store the json file in two different ways. On one hand, it's possible to store
	static info in the server side, but some kind of intelligence is necessary, like Java or PHP. On the other hand, the json file can be
	stored in the client side, as cookies. This is the way it's going to be used. Jquery.cookies.js plugin will be used to make the work 
	with cookies easier.

23/09/2013 18:53

    The first step is almost finished. It includes a simple header, with two titles, two graphs and one form. The form is used to add data
    to the json files. These json files will be stored locally in the client side as cookies. To encode and decode the json files (cookies), 
    the javascript methods JSON.parse and JSON.stringify will be used, respectively. The page structure will be divided into main html file,
    which contains the tags, css stylesheet file and js javascript files.

12/10/2013

    On day 07/10/2013, tutor and me met and discover that my planning for the project was not correct. I had to read from a physical json file
    (which a get call) and draw it using flotr2. The json files with which I'm working right now have been obtained from openstack webpage.
    I'm also going to start working with gridster (js library for presentation). I should have done some kind of adjunt about Gridster and Flotr2 
    for 20/10/2013.
    
   The firstStep.html page has been udpated. Now it includes two graphs showing the commit temporal evolution of two companies, HP and IBM.
   These graphs are tracking the mouse and they show the label with value and month. 

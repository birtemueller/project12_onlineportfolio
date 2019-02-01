var selectedProject;
var projectData;
var cardsHTML;
var skills;

//get the project data from JSON file
$.ajax({
    type : 'GET',
    dataType : 'json',
    url: 'content.json',
    async: false,
    success : function(data) {
        projects = data.projects;
        displayProjects();
    }
});

function displayProjects() {
    cardsHTML = '<div class="row">';

    //list the projects and create the HTML Structure
    $.each(projects, function (i, project) {
        //list the skills used in this project
        skills = project.skills;
        //var skillsHTML = '<span class="h6">Skills: </span>';
        var skillsHTML = '';
        $.each(skills, function (i, skill) {
            skillsHTML +=             '<span class="badge badge-info">\  ' +  skill  + ' \</span>\n';
        });

        cardsHTML += '<div class="col-lg-4 col-md-6 project" data-toggle="modal" data-target="#projectModal" id="' + i  + '\">\n' +
            '            <div class="card mb-3">\n' +
            '                    <img src="' + project.img + '\" class="card-img-top mx-auto p-3" alt="\  ' + project.name + ' \">\n' +
            '                <div class="card-body">\n' +
            '                    <h5 class="card-title">\  ' + project.name + ' \</h5>\n'
            + skillsHTML +
            '                    <button type="button" class="btn btn-primary d-block mt-3" data-toggle="modal" data-target="#projectModal">\n' +
            '                       See details\n' +
            '                    </button>' +
            '                </div>\n' +
            '            </div>\n' +
            '        </div>';

        $('#projects').html(cardsHTML);
    });
    cardsHTML += '</div>';
}

//filter projects based on selected option from dropdown
$("#filter")
    .change(function () {
        var filteredSkill;
        $("select option:selected").each(function () {
            filteredSkill = $(this).val();
        });

        $('.project').css('display', 'none');
        $.each(projects, function (i, project) {
            skills = project.skills;

            if (filteredSkill === "default") {
                $('.project').css('display', 'block');
            } else if (skills.includes(filteredSkill)) {
                $('#' + i).css('display', 'block');
            }
        });
    });

//open the modal box
$(document).on("click", '.project', function(e) {
    selectedProject = parseInt($(e.target).closest('.project').attr('id'));
    displayModal();
});

//set up project data in modal
function displayModal() {
    projectData = projects[selectedProject];

    $('.modal-title').text(projectData.name);
    $('.modal-img').prop("src", projectData.img);
    $('#btn-more').prop("href", projectData.github);
    $('.modal-text').html(projectData.description);
    setControls();
}

//remove controls for first and last project
function setControls() {
    $('.switch-control').css({display: 'flex'});
    if (selectedProject === projects.length - 1) {
        $('.switch-forth').css({display: 'none'});
    } else if (selectedProject === 0) {
        $('.switch-back').css({display: 'none'});
    }
}

//switch back and forth...
function switchProject(dir){
    selectedProject = selectedProject + dir;
    displayModal();
}

//...by clicking...
$(document).on("click", '.switch-control', function(e) {
    if ($(e.target).hasClass('switch-back')) {
        switchProject(-1);
    } else if ($(e.target).hasClass('switch-forth')) {
        switchProject(+1);
    }
});

//...or pressing the arrow keys
$(document).keydown( function(e) {
    console.log();
    e = e || window.event;
    //but only if it's not the first...
    if (e.keyCode == '37' && selectedProject > 0) {
        switchProject(-1);
    } //...or the last project
    else if (e.keyCode == '39' && selectedProject < (projects.length-1) ) {
        switchProject(+1);
    }
});
describe('Client Display Tests', () => {

    const snapshotOptions = {
        blackout: ['[data-cy=pointHistoryChart]'],
    };
    const sizes = [
        'iphone-6',
        'ipad-2',
        'default',
        // [1200, 1080],
    ];

    before(() => {
        cy.disableUILogin();

        Cypress.Commands.add("cdInitProjWithSkills", () => {
            cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
                projectId: 'proj1',
                subjectId: 'subj1',
                name: 'Subject 1',
                helpUrl: 'http://doHelpOnThisSubject.com',
                iconClass: "fas fa-jedi",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
            });
            cy.request('POST', '/admin/projects/proj1/subjects/subj2', {
                projectId: 'proj1',
                subjectId: 'subj2',
                name: 'Subject 2',
                iconClass: "fas fa-ghost",
            });
            cy.request('POST', '/admin/projects/proj1/subjects/subj3', {
                projectId: 'proj1',
                subjectId: 'subj3',
                name: 'Subject 3'
            });
            cy.request('POST', `/admin/projects/proj1/subjects/subj1/skills/skill1`, {
                projectId: 'proj1',
                subjectId: 'subj1',
                skillId: 'skill1',
                name: `This is 1`,
                type: 'Skill',
                pointIncrement: 100,
                numPerformToCompletion: 5,
                pointIncrementInterval: 0,
                numMaxOccurrencesIncrementInterval: -1,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                version: 0,
                helpUrl: 'http://doHelpOnThisSkill.com'
            });

            cy.request('POST', `/admin/projects/proj1/subjects/subj1/skills/skill2`, {
                projectId: 'proj1',
                subjectId: 'subj1',
                skillId: 'skill2',
                name: `This is 2`,
                type: 'Skill',
                pointIncrement: 100,
                numPerformToCompletion: 5,
                pointIncrementInterval: 0,
                numMaxOccurrencesIncrementInterval: -1,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                version: 0,
                helpUrl: 'http://doHelpOnThisSkill.com'
            });
            cy.request('POST', `/admin/projects/proj1/subjects/subj1/skills/skill3`, {
                projectId: 'proj1',
                subjectId: 'subj1',
                skillId: 'skill3',
                name: `This is 3`,
                type: 'Skill',
                pointIncrement: 100,
                numPerformToCompletion: 2,
                pointIncrementInterval: 0,
                numMaxOccurrencesIncrementInterval: -1,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                version: 0,
                helpUrl: 'http://doHelpOnThisSkill.com'
            });

            cy.request('POST', `/admin/projects/proj1/subjects/subj1/skills/skill4`, {
                projectId: 'proj1',
                subjectId: 'subj1',
                skillId: 'skill4',
                name: `This is 4`,
                type: 'Skill',
                pointIncrement: 100,
                numPerformToCompletion: 2,
                pointIncrementInterval: 0,
                numMaxOccurrencesIncrementInterval: -1,
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                version: 0,
                helpUrl: 'http://doHelpOnThisSkill.com'
            });
            cy.request('POST', `/admin/projects/proj1/skills/skill4/dependency/skill2`)

            cy.request('POST', '/admin/projects/proj1/badges/badge1', {
                projectId: 'proj1',
                badgeId: 'badge1',
                name: 'Badge 1',
                "iconClass":"fas fa-ghost",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            });

            cy.request('POST', '/admin/projects/proj1/badges/badge2', {
                projectId: 'proj1',
                badgeId: 'badge2',
                name: 'Badge 2',
                "iconClass":"fas fa-monument",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            });

            cy.request('POST', '/admin/projects/proj1/badges/badge3', {
                projectId: 'proj1',
                badgeId: 'badge3',
                name: 'Badge 3',
                "iconClass":"fas fa-jedi",
                description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            });

            cy.request('POST', '/admin/projects/proj1/badge/badge1/skills/skill1')
            cy.request('POST', '/admin/projects/proj1/badge/badge1/skills/skill2')
            cy.request('POST', '/admin/projects/proj1/badge/badge1/skills/skill3')

            cy.request('POST', '/admin/projects/proj1/badge/badge2/skills/skill3')

            cy.request('POST', `/api/projects/proj1/skills/skill1`, {userId: 'user0', timestamp: new Date().getTime()})
            cy.request('POST', `/api/projects/proj1/skills/skill1`, {userId: 'user0', timestamp: new Date().getTime() - 1000*60*60*24})

            cy.request('POST', `/api/projects/proj1/skills/skill3`, {userId: 'user0', timestamp: new Date().getTime()})
            cy.request('POST', `/api/projects/proj1/skills/skill3`, {userId: 'user0', timestamp: new Date().getTime() - 1000*60*60*24})
        });


    });

    after(function () {
        cy.enableUILogin();
    });

    beforeEach(() => {
        Cypress.env('disabledUILoginProp', true);
        cy.request('POST', '/app/projects/proj1', {
            projectId: 'proj1',
            name: 'proj1'
        });
    });

    sizes.forEach((size) => {
        it(`test theming - ${size}`, () => {
            cy.setResolution(size);

            cy.cdInitProjWithSkills();

            cy.cdVisit('/?enableTheme=true')
            // hex #626d7d = rgb(98, 109, 125)
            cy.get("#app").should('have.css', 'background-color')
                .and('equal', 'rgb(98, 109, 125)');

            cy.get('[data-cy=pointHistoryChart]')

            cy.contains('Subject 3');
            cy.get('.user-skill-subject-tile:nth-child(1)').contains('Subject 1');
            cy.get('[data-cy=myRank]').contains('1');
            cy.get('[data-cy=myBadges]').contains('1 Badge')
            cy.matchImageSnapshot(`Project-Overview_${size}`, snapshotOptions);

            // back button - border color
            cy.cdClickRank();
            // THEME: "pageTitleTextColor": "#fdfbfb",
            cy.get('[data-cy=back]').should('have.css', 'border-color')
                .and('equal', 'rgb(253, 251, 251)');
            cy.get('[data-cy=back]').should('have.css', 'color')
                .and('equal', 'rgb(253, 251, 251)');

            // wait for the bar (on the bar chart) to render
            cy.wait(1000);
            cy.contains('You are Level 2!');
            cy.matchImageSnapshot(`Project-Rank_${size}`, snapshotOptions);

            cy.cdBack();
            cy.cdClickBadges();
            cy.contains('Badge 3')
            cy.contains('a few seconds ago')
            cy.matchImageSnapshot(`Badges_${size}`, snapshotOptions);

            cy.contains('View Details').click()
            cy.contains('Badge 1');
            cy.contains('This is 3');
            cy.matchImageSnapshot(`Badge-Details_${size}`, snapshotOptions);

            cy.cdBack('Badges');
            cy.cdBack();
            cy.cdClickSubj(0);
            cy.contains('Subject 1')
            cy.get('[data-cy=myRank]').contains('1');
            cy.contains('This is 4');
            cy.contains('200 Points earned Today');
            cy.matchImageSnapshot(`Subject0-Overview_${size}`, snapshotOptions);

            cy.get('[data-cy=toggleSkillDetails]').click();
            cy.get('[data-cy=myRank]').contains('1');
            cy.contains('Lorem ipsum dolor sit amet');
            cy.contains('Skill has 1 direct dependent(s).');
            cy.contains('200 Points earned Today');
            cy.contains('Description');
            cy.matchImageSnapshot(`Subject0-Overview-WithSkillDetails_${size}`, snapshotOptions);

            cy.cdClickSkill(0);
            cy.contains('Skill Overview')
            cy.contains('This is 1');
            cy.contains('Lorem ipsum dolor sit amet');
            cy.matchImageSnapshot(`Subject0-Skill0-Details_${size}`, snapshotOptions);

            cy.cdBack('Subject 1');
            cy.cdClickSkill(3);
            cy.contains('Skill Overview')
            cy.contains('This is 4');
            cy.contains('Lorem ipsum dolor sit amet');
            cy.contains('Achieved Dependencies');
            // wait for graph to finish animating
            cy.wait(4000);
            cy.matchImageSnapshot(`Subject0-Skill3-Details_${size}`, snapshotOptions);
        });

    });

    it(`test theming - No Subjects`, () => {
        cy.cdVisit('/?enableTheme=true')
        cy.contains('User Skills');
        cy.get('[data-cy=myRank]').contains('1');
        cy.contains('0 Points earned Today');
        cy.contains('Subjects have not been added yet.');
        cy.matchImageSnapshot(`Project-Overview-No_Subjects`, snapshotOptions);
    });


    it('test theming - Empty Subject', () => {
        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: 'Subject 1',
            helpUrl: 'http://doHelpOnThisSubject.com',
            iconClass: "fas fa-jedi",
            description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."
        });


        cy.cdVisit('/?enableTheme=true')
        cy.contains('User Skills');

        cy.cdClickSubj(0);
        cy.contains('Subject 1');
        cy.contains('Skills have not been added yet.')
        cy.get('[data-cy=myRank]').contains('1');
        cy.contains('0 Points earned Today');
        cy.contains('Description');
        cy.matchImageSnapshot('Project-Overview-Empty_Subject', snapshotOptions);
    });


});
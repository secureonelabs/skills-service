/*
 * Copyright 2020 SkillTree
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
var moment = require('moment-timezone');

describe('Metrics Tests - Skills', () => {

    beforeEach(() => {
        cy.request('POST', '/app/projects/proj1', {
            projectId: 'proj1',
            name: 'proj1'
        });

        cy.cleanupDownloadsDir()
    });

    it('skills table - empty table', () => {
        cy.intercept('/admin/projects/proj1/metrics/skillUsageNavigatorChartBuilder')
            .as('skillUsageNavigatorChartBuilder');
        cy.visit('/administrator/projects/proj1/');
        cy.clickNav('Metrics');
        cy.get('[data-cy=metricsNav-Skills]')
            .click();
        cy.wait('@skillUsageNavigatorChartBuilder');

        cy.get('[data-cy=skillsNavigator]')
            .contains('There are no records to show');
    });

    it('skills table - format column with numbers', () => {

        const res = { skills: [{
            'skillId': 'skill1',
            'skillName': 'Very Great Skill # 1',
            'subjectId': 'subj1',
            'numUserAchieved': 8574,
            'numUsersInProgress': 2834,
            'lastReportedTimestamp': null,
            'lastAchievedTimestamp': null
        }, {
            'skillId': 'skill2',
            'skillName': 'Very Great Skill # 2',
            'subjectId': 'subj1',
            'numUserAchieved': 9383,
            'numUsersInProgress': 2783,
            'lastReportedTimestamp': null,
            'lastAchievedTimestamp': null
        }], tags: [] };

        cy.intercept({
            path: '/admin/projects/proj1/metrics/skillUsageNavigatorChartBuilder**',
        }, {
            statusCode: 200,
            body: res,
        })
            .as('skillUsageNavigatorChartBuilder');
        cy.visit('/administrator/projects/proj1/');
        cy.clickNav('Metrics');
        cy.get('[data-cy=metricsNav-Skills]')
            .click();
        cy.wait('@skillUsageNavigatorChartBuilder');

        const tableSelector = '[data-cy=skillsNavigator-table]';
        const expected = [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 1'
            }, {
                colIndex: 1,
                value: '8,574'
            }, {
                colIndex: 2,
                value: '2,834'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 2'
            }],
        ];
        cy.validateTable(tableSelector, expected);
    });

    it('skills table - paging', () => {
        cy.intercept('/admin/projects/proj1/metrics/skillUsageNavigatorChartBuilder')
            .as('skillUsageNavigatorChartBuilder');

        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: 'Interesting Subject 1',
        });

        const numSkills = 8;
        for (let skillsCounter = 1; skillsCounter <= numSkills; skillsCounter += 1) {
            cy.request('POST', `/admin/projects/proj1/subjects/subj1/skills/skill${skillsCounter}`, {
                projectId: 'proj1',
                subjectId: 'subj1',
                skillId: `skill${skillsCounter}`,
                name: `Very Great Skill # ${skillsCounter}`,
                pointIncrement: '50',
                numPerformToCompletion: '1',
            });
        }
        ;

        cy.visit('/administrator/projects/proj1/');
        cy.clickNav('Metrics');
        cy.get('[data-cy=metricsNav-Skills]')
            .click();
        cy.wait('@skillUsageNavigatorChartBuilder');

        const tableSelector = '[data-cy=skillsNavigator-table]';
        cy.validateTable(tableSelector, [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 1'
            }, {
                colIndex: 3,
                value: 'Never'
            }, {
                colIndex: 4,
                value: 'Never'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 2'
            }, {
                colIndex: 3,
                value: 'Never'
            }, {
                colIndex: 4,
                value: 'Never'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 3'
            }, {
                colIndex: 3,
                value: 'Never'
            }, {
                colIndex: 4,
                value: 'Never'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 4'
            }, {
                colIndex: 3,
                value: 'Never'
            }, {
                colIndex: 4,
                value: 'Never'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 5'
            }, {
                colIndex: 3,
                value: 'Never'
            }, {
                colIndex: 4,
                value: 'Never'
            }],
        ], 5, true, 8);

        // test paging
        cy.validateTable(tableSelector, [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 1'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 2'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 3'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 4'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 5'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 6'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 7'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 8'
            }],
        ]);

        // test page size
        cy.get('[data-pc-name="pcrowperpagedropdown"]').click().get('[data-pc-section="option"]').contains('10').click();
        cy.validateTable(tableSelector, [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 1'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 2'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 3'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 4'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 5'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 6'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 7'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 8'
            }],
        ], 10, true, 8);

        // export skill metrics and verify that the file exists
        const exportedFileName = `cypress/downloads/proj1-skill-metrics-${moment.utc().format('YYYY-MM-DD')}.xlsx`;
        cy.readFile(exportedFileName).should('not.exist');
        cy.get('[data-cy="exportSkillsTableBtn"]').click();
        cy.readFile(exportedFileName).should('exist');
    });

    it('skills table - exporting shows loading indicator', () => {
        cy.intercept('/admin/projects/proj1/metrics/skillUsageNavigatorChartBuilder')
          .as('skillUsageNavigatorChartBuilder');

        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: 'Interesting Subject 1',
        });

        const numSkills = 8;
        for (let skillsCounter = 1; skillsCounter <= numSkills; skillsCounter += 1) {
            cy.request('POST', `/admin/projects/proj1/subjects/subj1/skills/skill${skillsCounter}`, {
                projectId: 'proj1',
                subjectId: 'subj1',
                skillId: `skill${skillsCounter}`,
                name: `Very Great Skill # ${skillsCounter}`,
                pointIncrement: '50',
                numPerformToCompletion: '1',
            });
        }

        cy.visit('/administrator/projects/proj1/');
        cy.clickNav('Metrics');
        cy.get('[data-cy=metricsNav-Skills]')
          .click();
        cy.wait('@skillUsageNavigatorChartBuilder');

        // delay export and verify loading indicator is showing
        cy.intercept('GET', 'admin/projects/proj1/skills/export/excel', {
            delay: 1000
        }).as('exportSkillsTable');
        const exportedFileName = `cypress/downloads/proj1-subj1-skills-${moment.utc().format('YYYY-MM-DD')}.xlsx`;
        cy.get('[data-cy="exportSkillsTableBtn"]').click();
        cy.get('[data-cy="skillsNavigator-loading"]').should('exist');
        cy.wait('@exportSkillsTable');
        cy.get('[data-cy="skillsNavigator-loading"]').should('not.exist');
    });

    it('skills table - skill usage filtering', () => {
        // have to make viewport very wide so all the tags are on the same line
        // looks like there is an issue with cypress not being able to click on a tag
        // if it's pushed to the 2nd line
        cy.viewport(2048, 1024);
        cy.intercept('/admin/projects/proj1/metrics/skillUsageNavigatorChartBuilder')
            .as('skillUsageNavigatorChartBuilder');

        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: 'Interesting Subject 1',
        });

        const numSkills = 17;
        for (let skillsCounter = 1; skillsCounter <= numSkills; skillsCounter += 1) {
            cy.request('POST', `/admin/projects/proj1/subjects/subj1/skills/skill${skillsCounter}`, {
                projectId: 'proj1',
                subjectId: 'subj1',
                skillId: `skill${skillsCounter}`,
                name: `Very Great Skill # ${skillsCounter}`,
                pointIncrement: '50',
                numPerformToCompletion: skillsCounter < 17 ? '1' : '2',
            });
        }

        const m = moment.utc('2020-09-12 11', 'YYYY-MM-DD HH');
        const skip = [3, 6];
        for (let skillsCounter = 1; skillsCounter <= numSkills; skillsCounter += 1) {
            if (!skip.includes(skillsCounter)) {
                for (let i = 0; i < skillsCounter; i += 1) {
                    cy.request('POST', `/api/projects/proj1/skills/skill${skillsCounter}`,
                        {
                            userId: `user${i}achieved@skills.org`,
                            timestamp: m.clone()
                                .subtract(skillsCounter, 'day')
                                .format('x')
                        });
                }
            }
        }

        cy.visit('/administrator/projects/proj1/');
        cy.clickNav('Metrics');
        cy.get('[data-cy=metricsNav-Skills]')
            .click();
        cy.wait('@skillUsageNavigatorChartBuilder');

        cy.get('[data-cy=overlookedFilterButton]').click();
        cy.get('[data-cy=skillsNavigator-filterBtn]').click();

        const tableSelector = '[data-cy=skillsNavigator-table]';

        cy.get(`${tableSelector} th`)
            .contains('Skill')
            .click();
        cy.validateTable(tableSelector, [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 3'
            }, {
                colIndex: 1,
                value: 'Overlooked Skill'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 6'
            }, {
                colIndex: 1,
                value: 'Overlooked Skill'
            }],
        ]);

        cy.get('[data-cy=skillsNavigator-resetBtn]').click();
        cy.get('[data-cy=skillsBTableTotalRows]').contains(17);

        cy.get('[data-cy=topSkillFilterButton]').click();
        cy.get('[data-cy=skillsNavigator-filterBtn]').click();
        cy.validateTable(tableSelector, [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 16'
            }, {
                colIndex: 1,
                value: 'Top Skill'
            }],
        ]);

        cy.get('[data-cy=topSkillFilterButton]').click();
        cy.get('[data-cy=highActivityFilterButton]').click();
        cy.get('[data-cy=skillsNavigator-filterBtn]')
            .click();
        cy.validateTable(tableSelector, [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 17'
            }, {
                colIndex: 2,
                value: 'High Activity'
            }],
        ]);

        cy.get('[data-cy=neverAchievedFilterButton]').click();
        cy.get('[data-cy=highActivityFilterButton]').click();
        cy.get('[data-cy=skillsNavigator-filterBtn]').click();
        cy.validateTable(tableSelector, [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 3'
            }, {
                colIndex: 4,
                value: 'Never'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 6'
            }, {
                colIndex: 4,
                value: 'Never'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 17'
            }, {
                colIndex: 4,
                value: 'Never'
            }],
        ]);

        cy.get('[data-cy=neverAchievedFilterButton]').click();
        cy.get('[data-cy=neverReportedFilterButton]').click();
        cy.get('[data-cy=skillsNavigator-filterBtn]')
            .click();
        cy.validateTable(tableSelector, [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 3'
            }, {
                colIndex: 3,
                value: 'Never'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 6'
            }, {
                colIndex: 3,
                value: 'Never'
            }],
        ]);

        cy.get('[data-cy=neverAchievedFilterButton]').click();
        cy.get('[data-cy=skillsNavigator-filterBtn]')
            .click();
        cy.validateTable(tableSelector, [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 3'
            }, {
                colIndex: 3,
                value: 'Never'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 6'
            }, {
                colIndex: 3,
                value: 'Never'
            }],
        ]);

        cy.get('[data-cy=topSkillFilterButton]').click();
        cy.get('[data-cy=skillsNavigator-filterBtn]')
            .click();

        cy.get(tableSelector)
            .contains('There are no records to show');

        cy.get('[data-cy=skillsNavigator-resetBtn]')
            .click();
        cy.get('[data-cy=skillsBTableTotalRows]')
            .contains(17);

        cy.get('[data-cy=skillsNavigator-skillNameFilter]')
            .type('12');
        cy.get('[data-cy=skillsNavigator-filterBtn]')
            .click();
        cy.validateTable(tableSelector, [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 12'
            }],
        ]);

        cy.get('[data-cy=skillsNavigator-skillNameFilter]')
            .clear()
            .type('3');
        cy.get('[data-cy=overlookedFilterButton]').click();
        cy.get('[data-cy=skillsNavigator-filterBtn]')
            .click();
        cy.validateTable(tableSelector, [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 3'
            }, {
                colIndex: 1,
                value: 'Overlooked Skill'
            }],
        ]);

    });

    it('skill name filter submit on enter', () => {
        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: 'Interesting Subject 1',
        });

        cy.request('POST', `/admin/projects/proj1/subjects/subj1/skills/vgsk1`, {
            projectId: 'proj1',
            subjectId: 'subj1',
            skillId: `vgsk1`,
            name: `Very Great Skill # 1`,
            pointIncrement: '50',
            numPerformToCompletion: '1',
        });

        cy.request('POST', `/admin/projects/proj1/subjects/subj1/skills/nsgsk1`, {
            projectId: 'proj1',
            subjectId: 'subj1',
            skillId: `nsgsk1`,
            name: `Not So Great Skill # 1`,
            pointIncrement: '50',
            numPerformToCompletion: '1',
        });

        cy.intercept('/admin/projects/proj1/metrics/skillUsageNavigatorChartBuilder')
            .as('skillUsageNavigatorChartBuilder');

        cy.visit('/administrator/projects/proj1/metrics/skills');
        cy.wait('@skillUsageNavigatorChartBuilder');

        cy.get('[data-cy=skillsBTableTotalRows]').should('contain', 2);
        cy.wait(1000)
        cy.get('[data-cy=skillsNavigator-skillNameFilter]')
            .type('not so{enter}', { delay: 100, waitForAnimations: true });
        cy.get('[data-cy=skillsBTableTotalRows]').should('contain', 1);
    });

    it('skills table - tag filtering', () => {
        // have to make viewport very wide so all the tags are on the same line
        // looks like there is an issue with cypress not being able to click on a tag
        // if it's pushed to the 2nd line
        cy.viewport(2048, 1024);
        cy.intercept('/admin/projects/proj1/metrics/skillUsageNavigatorChartBuilder')
            .as('skillUsageNavigatorChartBuilder');

        cy.request('POST', '/admin/projects/proj1/subjects/subj1', {
            projectId: 'proj1',
            subjectId: 'subj1',
            name: 'Interesting Subject 1',
        });

        const numSkills = 17;
        for (let skillsCounter = 1; skillsCounter <= numSkills; skillsCounter += 1) {
            cy.request('POST', `/admin/projects/proj1/subjects/subj1/skills/skill${skillsCounter}`, {
                projectId: 'proj1',
                subjectId: 'subj1',
                skillId: `skill${skillsCounter}`,
                name: `Very Great Skill # ${skillsCounter}`,
                pointIncrement: '50',
                numPerformToCompletion: skillsCounter < 17 ? '1' : '2',
            });
        }

        const m = moment.utc('2020-09-12 11', 'YYYY-MM-DD HH');
        const skip = [3, 6];
        for (let skillsCounter = 1; skillsCounter <= numSkills; skillsCounter += 1) {
            if (!skip.includes(skillsCounter)) {
                for (let i = 0; i < skillsCounter; i += 1) {
                    cy.request('POST', `/api/projects/proj1/skills/skill${skillsCounter}`,
                        {
                            userId: `user${i}achieved@skills.org`,
                            timestamp: m.clone()
                                .subtract(skillsCounter, 'day')
                                .format('x')
                        });
                }
            }
        }

        let skills = [];
        for (let skillsCounter = 1; skillsCounter <= numSkills; skillsCounter += 1) {
            skills.push(`skill${skillsCounter}`);
        }

        cy.addTagToSkills(1, skills, 1);
        cy.addTagToSkills(1, ['skill3', 'skill6'], 2);

        cy.visit('/administrator/projects/proj1/');
        cy.clickNav('Metrics');
        cy.get('[data-cy=metricsNav-Skills]')
            .click();
        cy.wait('@skillUsageNavigatorChartBuilder');

        cy.get('[data-cy=skillTag-filters]').should('exist');
        cy.get('[data-cy=skillTag-filters]').contains('TAG 2').click({force: true});

        cy.get('[data-cy=skillsNavigator-filterBtn]')
            .click();

        const tableSelector = '[data-cy=skillsNavigator-table]';

        cy.get(`${tableSelector} th`)
            .contains('Skill')
            .click();
        cy.validateTable(tableSelector, [
            [{
                colIndex: 0,
                value: 'Very Great Skill # 3'
            }, {
                colIndex: 1,
                value: 'Overlooked Skill'
            }],
            [{
                colIndex: 0,
                value: 'Very Great Skill # 6'
            }, {
                colIndex: 1,
                value: 'Overlooked Skill'
            }],
        ]);

        cy.get('[data-cy=skillsNavigator-resetBtn]')
            .click();
        cy.get('[data-cy=skillsBTableTotalRows]')
            .contains(17);

    });
});

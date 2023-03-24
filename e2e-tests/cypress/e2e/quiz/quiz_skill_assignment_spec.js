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
import dayjs from 'dayjs';
import utcPlugin from 'dayjs/plugin/utc';

dayjs.extend(utcPlugin);

describe('Quiz Skill Assignment Tests', () => {

    beforeEach(() => {

    });

    it('assign quiz to skill', function () {
        cy.createProject(1)
        cy.createSubject(1,1)

        cy.createQuizDef(1, {name: 'Test Your Trivia Knowledge'});
        cy.visit('/administrator/projects/proj1/subjects/subj1');
        cy.get('[data-cy="newSkillButton"]').click()
        cy.get('[data-cy="skillName"]').type('abc')
        cy.get('[data-cy="numPerformToCompletion"]').type('5')
        cy.get('[data-cy="selfReportEnableCheckbox"]').check({ force: true });
        cy.get('[data-cy="saveSkillButton"]').should('be.enabled')

        cy.get('[data-cy="quizSelector"]').should('not.exist')
        cy.get('[data-cy="quizRadio"]').click({ force: true })
        cy.get('[data-cy="saveSkillButton"]').should('be.disabled')
        cy.get('[data-cy="quizSelected-quiz1"]').should('not.exist')

        cy.get('[data-cy="numPerformToCompletion"]').should('have.value', 1)
        cy.get('[data-cy="numPerformToCompletion"]').should('be.disabled')

        cy.get('[data-cy="quizSelector"]').click()
        cy.get('[data-cy="availableQuizSelection-quiz1"]').click()
        cy.get('[data-cy="quizSelected-quiz1"]')
        cy.get('[data-cy="saveSkillButton"]').should('be.enabled')
        cy.get('[data-cy="saveSkillButton"]').click()
        cy.get('[data-cy="skillsTable-additionalColumns"]').contains('Self Report').click();
        cy.get('[data-cy="selfReportCell-abcSkill-quiz"]').contains('Quiz-Based Validation')
        cy.get('[data-cy="selfReportCell-abcSkill-quiz"]').contains('Test Your Trivia Knowledge').click()
        cy.url().should('include', '/administrator/quizzes/quiz1');
        cy.get('[data-cy="pageHeaderStat_Type"] [data-cy="statPreformatted"]').should('have.text', 'Quiz')
    });

    it('edit skill modal - set occurrences to 1 when quiz type is selected', function () {
        cy.createProject(1)
        cy.createSubject(1,1)

        cy.createQuizDef(1, {name: 'Test Your Trivia Knowledge'});
        cy.visit('/administrator/projects/proj1/subjects/subj1');
        cy.get('[data-cy="newSkillButton"]').click()
        cy.get('[data-cy="skillName"]').type('abc')
        cy.get('[data-cy="numPerformToCompletion"]').type('5')
        cy.get('[data-cy="selfReportEnableCheckbox"]').check({ force: true });

        cy.get('[data-cy="numPerformToCompletion"]').should('have.value', 15)

        cy.get('[data-cy="selfReportTypeSelector"] [value="HonorSystem"]').click({ force: true });
        cy.get('[data-cy="numPerformToCompletion"]').should('have.value', 15)

        cy.get('[data-cy="quizRadio"]').click({ force: true })
        cy.get('[data-cy="numPerformToCompletion"]').should('have.value', 1)
        cy.get('[data-cy="numPerformToCompletion"]').should('be.disabled')

        cy.get('[data-cy="quizSelector"]').click()
        cy.get('[data-cy="availableQuizSelection-quiz1"]').click()

        cy.get('[data-cy="selfReportTypeSelector"] [value="Approval"]').click({ force: true });
        cy.get('[data-cy="numPerformToCompletion"]').should('have.value', 1)
        cy.get('[data-cy="numPerformToCompletion"]').should('be.enabled')

        cy.get('[data-cy="numPerformToCompletion"]').type('2')
        cy.get('[data-cy="numPerformToCompletion"]').should('have.value', 12)

        cy.get('[data-cy="quizRadio"]').click({ force: true })
        cy.get('[data-cy="numPerformToCompletion"]').should('have.value', 1)
        cy.get('[data-cy="numPerformToCompletion"]').should('be.disabled')

        cy.get('[data-cy="saveSkillButton"]').click()
        cy.get('[data-cy="skillsTable-additionalColumns"]').contains('Self Report').click();
        cy.get('[data-cy="selfReportCell-abcSkill-quiz"]').contains('Quiz-Based Validation')
    });

    it('edit existing skill - remove quiz assignment by disabling self report type', function () {
        cy.createProject(1)
        cy.createSubject(1,1)

        cy.createQuizDef(1, {name: 'Test Your Trivia Knowledge'});
        cy.createSkill(1, 1, 1, { selfReportingType: 'Quiz', quizId: 'quiz1',  pointIncrement: '150', numPerformToCompletion: 1 });
        cy.visit('/administrator/projects/proj1/subjects/subj1');

        cy.get('[data-cy="editSkillButton_skill1"]').click();
        cy.get('[data-cy="selfReportEnableCheckbox"]').should('be.checked');
        cy.get('[data-cy="selfReportTypeSelector"] [value="Quiz"]').should('be.checked');
        cy.get('[data-cy="quizSelected-quiz1"]')
        cy.get('[data-cy="selfReportTypeSelector"] [value="Approval"]').should('not.be.checked');
        cy.get('[data-cy="selfReportTypeSelector"] [value="HonorSystem"]').should('not.be.checked');
        cy.get('[data-cy="numPerformToCompletion"]').should('have.value', 1)
        cy.get('[data-cy="numPerformToCompletion"]').should('be.disabled')

        cy.get('[data-cy="selfReportEnableCheckbox"]').uncheck({ force: true });
        cy.get('[data-cy="numPerformToCompletion"]').should('have.value', 1)
        cy.get('[data-cy="numPerformToCompletion"]').should('be.enabled')

        cy.get('[data-cy="selfReportTypeSelector"] [value="Approval"]').should('be.disabled');
        cy.get('[data-cy="selfReportTypeSelector"] [value="HonorSystem"]').should('be.disabled');
        cy.get('[data-cy="selfReportTypeSelector"] [value="Quiz"]').should('be.disabled');
        cy.get('[data-cy="quizSelector"]').should('not.exist')

        cy.get('[data-cy="saveSkillButton"]').click()
        cy.get('[data-cy="skillsTable-additionalColumns"]').contains('Self Report').click();
        cy.get('[data-cy="selfReportCell-skill1"]').contains('Disabled')
    });

    it('edit existing skill - remove quiz assignment by changing self report type', function () {
        cy.createProject(1)
        cy.createSubject(1,1)

        cy.createQuizDef(1, {name: 'Test Your Trivia Knowledge'});
        cy.createSkill(1, 1, 1, { selfReportingType: 'Quiz', quizId: 'quiz1',  pointIncrement: '150', numPerformToCompletion: 1 });
        cy.visit('/administrator/projects/proj1/subjects/subj1');

        cy.get('[data-cy="editSkillButton_skill1"]').click();
        cy.get('[data-cy="selfReportEnableCheckbox"]').should('be.checked');
        cy.get('[data-cy="selfReportTypeSelector"] [value="Quiz"]').should('be.checked');
        cy.get('[data-cy="quizSelected-quiz1"]')
        cy.get('[data-cy="selfReportTypeSelector"] [value="Approval"]').should('not.be.checked');
        cy.get('[data-cy="selfReportTypeSelector"] [value="HonorSystem"]').should('not.be.checked');
        cy.get('[data-cy="numPerformToCompletion"]').should('have.value', 1)
        cy.get('[data-cy="numPerformToCompletion"]').should('be.disabled')

        cy.get('[data-cy="selfReportTypeSelector"] [value="HonorSystem"]').click({ force: true });
        cy.get('[data-cy="numPerformToCompletion"]').should('have.value', 1)
        cy.get('[data-cy="numPerformToCompletion"]').should('be.enabled')

        cy.get('[data-cy="selfReportTypeSelector"] [value="Approval"]').should('not.be.checked');
        cy.get('[data-cy="selfReportTypeSelector"] [value="HonorSystem"]').should('be.checked');
        cy.get('[data-cy="selfReportTypeSelector"] [value="Quiz"]').should('not.be.checked');
        cy.get('[data-cy="quizSelector"]').should('not.exist')

        cy.get('[data-cy="saveSkillButton"]').click()
        cy.get('[data-cy="skillsTable-additionalColumns"]').contains('Self Report').click();
        cy.get('[data-cy="selfReportCell-skill1"]').contains('Honor System')
    });

    it('edit existing skill - change quiz id', function () {
        cy.createProject(1)
        cy.createSubject(1,1)

        cy.createQuizDef(1);
        cy.createSurveyDef(2);
        cy.createSkill(1, 1, 1, { selfReportingType: 'Quiz', quizId: 'quiz1',  pointIncrement: '150', numPerformToCompletion: 1 });
        cy.visit('/administrator/projects/proj1/subjects/subj1');

        cy.get('[data-cy="editSkillButton_skill1"]').click();

        cy.get('[data-cy="quizSelector"]').click()
        cy.get('[data-cy="availableQuizSelection-quiz2"]').click()
        cy.get('[data-cy="quizSelected-quiz2"]')
        cy.get('[data-cy="saveSkillButton"]').click()
        cy.get('[data-cy="skillsTable-additionalColumns"]').contains('Self Report').click();
        cy.get('[data-cy="selfReportCell-skill1-quiz"]').contains('Survey-Based Validation')
        cy.get('[data-cy="selfReportCell-skill1-quiz"]').contains('This is survey 2').click()
        cy.url().should('include', '/administrator/quizzes/quiz2');
        cy.get('[data-cy="pageHeaderStat_Type"] [data-cy="statPreformatted"]').should('have.text', 'Survey')

    });

    it('user has no quizzes to assign', function () {
        cy.createProject(1)
        cy.createSubject(1,1)

        cy.visit('/administrator/projects/proj1/subjects/subj1');
        cy.get('[data-cy="newSkillButton"]').click()
        cy.get('[data-cy="skillName"]').type('abc')
        cy.get('[data-cy="selfReportEnableCheckbox"]').check({ force: true });
        cy.get('[data-cy="quizRadio"]').click({ force: true })
        cy.get('[data-cy="quizSelector"]').click()

        cy.get('[data-cy="quizSelectHasNoValues"]').contains('You currently do not administer any')
        cy.get('[data-cy="quizSelectHasNoValues"] a')
            .should('have.attr', 'href')
            .and('eq', '/administrator/quizzes')
    });

    it('search quizzes and surveys when selecting', function () {
        cy.createProject(1)
        cy.createSubject(1,1)

        for (let i = 1; i < 15; i++) {
            if (i % 2 === 0) {
                cy.createSurveyDef(i);
            } else {
                cy.createQuizDef(i);
            }
        }
        cy.visit('/administrator/projects/proj1/subjects/subj1');
        cy.get('[data-cy="newSkillButton"]').click()
        cy.get('[data-cy="selfReportEnableCheckbox"]').check({ force: true });
        cy.get('[data-cy="quizRadio"]').click({ force: true })
        cy.get('[data-cy="quizSelector"]').click()
        cy.get('[data-cy="availableQuizSelection-quiz1"]').contains('This is quiz 1')
        cy.get('[data-cy="availableQuizSelection-quiz2"]').contains('This is survey 2')
        cy.get('[data-cy="availableQuizSelection-quiz3"]')
        cy.get('[data-cy="availableQuizSelection-quiz4"]')
        cy.get('[data-cy="availableQuizSelection-quiz5"]')
        cy.get('[data-cy="availableQuizSelection-quiz6"]')
        cy.get('[data-cy="availableQuizSelection-quiz7"]')
        cy.get('[data-cy="availableQuizSelection-quiz8"]')
        cy.get('[data-cy="availableQuizSelection-quiz9"]')
        cy.get('[data-cy="availableQuizSelection-quiz10"]')
        cy.get('[data-cy="availableQuizSelection-quiz11"]')
        cy.get('[data-cy="availableQuizSelection-quiz12"]')
        cy.get('[data-cy="availableQuizSelection-quiz13"]')
        cy.get('[data-cy="availableQuizSelection-quiz14"]')

        cy.get('[data-cy="quizSelector"]').type('1')

        cy.get('[data-cy="availableQuizSelection-quiz1"]')
        cy.get('[data-cy="availableQuizSelection-quiz2"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz3"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz4"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz5"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz6"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz7"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz8"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz9"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz10"]')
        cy.get('[data-cy="availableQuizSelection-quiz11"]')
        cy.get('[data-cy="availableQuizSelection-quiz12"]')
        cy.get('[data-cy="availableQuizSelection-quiz13"]')
        cy.get('[data-cy="availableQuizSelection-quiz14"]')

        cy.get('[data-cy="quizSelector"]').type('2')

        cy.get('[data-cy="availableQuizSelection-quiz1"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz2"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz3"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz4"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz5"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz6"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz7"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz8"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz9"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz10"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz11"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz12"]')
        cy.get('[data-cy="availableQuizSelection-quiz13"]').should('not.exist')
        cy.get('[data-cy="availableQuizSelection-quiz14"]').should('not.exist')

        cy.get('[data-cy="quizSelector"]').type('a')
        cy.get('[data-cy="quizSelectHasNoValues"]').contains('No results')
    });

    it('reporting to quiz-based skill is not allowed', function () {
        cy.createQuizDef(1, { name: 'Trivia Knowledge' });
        cy.createQuizQuestionDef(1, 1);

        cy.createProject(1)
        cy.createSubject(1,1)
        cy.createSkill(1, 1, 1, { selfReportingType: 'Quiz', quizId: 'quiz1',  pointIncrement: '150', numPerformToCompletion: 1 });
        cy.visit('/administrator/projects/proj1/subjects/subj1/skills/skill1/addSkillEvent');
        cy.get('[data-cy="pageHeader"]').contains('Very Great Skill 1')
        const userIdSelector = '[data-cy=userIdInput]';
        const addButtonSelector = '[data-cy=addSkillEventButton]';
        cy.get(`${userIdSelector} input`).should('be.enabled')
        cy.get(userIdSelector).type('oTHIGHJK{enter}');
        cy.get(addButtonSelector).should('not.be.disabled')
        cy.get(addButtonSelector).click();
        cy.get('[data-cy="addedUserEventsInfo"]').contains('Unable to add points for [oTHIGHJK] - Cannot report skill events directly to a quiz-based skill');
    });

    it('view skill overview where quiz/survey is assigned', function() {
        cy.createProject(1)
        cy.createSubject(1,1)

        cy.createQuizDef(1, {name: 'Test Your Trivia Knowledge'});
        cy.createSurveyDef(2, {name: 'Need to know Info'});
        cy.createSkill(1, 1, 1, { selfReportingType: 'Quiz', quizId: 'quiz1',  pointIncrement: '150', numPerformToCompletion: 1 });
        cy.createSkill(1, 1, 2, { selfReportingType: 'Quiz', quizId: 'quiz2',  pointIncrement: '150', numPerformToCompletion: 1 });

        cy.visit('/administrator/projects/proj1/subjects/subj1/skills/skill1');
        cy.get('[data-cy="selfReportMediaCard"]').contains('Self Report: Quiz')
        cy.get('[data-cy="selfReportMediaCard"]').contains('Users can self report this skill and points will be awarded after the Test Your Trivia Knowledge Quiz is passed!')

        cy.visit('/administrator/projects/proj1/subjects/subj1/skills/skill2');
        cy.get('[data-cy="selfReportMediaCard"]').contains('Self Report: Survey')
        cy.get('[data-cy="selfReportMediaCard"]').contains('Users can self report this skill and points will be awarded after the Need to know Info Survey is completed!')
    });

});

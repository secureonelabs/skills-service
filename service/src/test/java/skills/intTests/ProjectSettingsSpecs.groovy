/**
 * Copyright 2021 SkillTree
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
package skills.intTests

import skills.intTests.utils.DefaultIntSpec
import skills.intTests.utils.SkillsClientException
import skills.intTests.utils.SkillsFactory
import skills.intTests.utils.SkillsService

import static skills.intTests.utils.SkillsFactory.createProject

class ProjectSettingsSpecs extends DefaultIntSpec {

    def "save custom labels project settings"() {
        def proj = SkillsFactory.createProject()

        skillsService.createProject(proj)

        when:

        skillsService.addOrUpdateProjectSetting(proj.projectId, 'project.displayName', 'Work Role')
        skillsService.addOrUpdateProjectSetting(proj.projectId, 'subject.displayName', 'Competency')
        skillsService.addOrUpdateProjectSetting(proj.projectId, 'group.displayName', 'KSA')
        skillsService.addOrUpdateProjectSetting(proj.projectId, 'skill.displayName', 'Course')
        skillsService.addOrUpdateProjectSetting(proj.projectId, 'level.displayName', 'Stage')
        def projectSettings = skillsService.getProjectSettings(proj.projectId)

        then:
        projectSettings
        projectSettings.find { it.setting == 'project.displayName'}?.value == 'Work Role'
        projectSettings.find { it.setting == 'subject.displayName'}?.value == 'Competency'
        projectSettings.find { it.setting == 'group.displayName'}?.value == 'KSA'
        projectSettings.find { it.setting == 'skill.displayName'}?.value == 'Course'
        projectSettings.find { it.setting == 'level.displayName'}?.value == 'Stage'
    }

    def "save custom project label setting with value exceeding max"(){
        def proj = SkillsFactory.createProject()
        skillsService.createProject(proj)

        def label = (1..51).collect{"A"}.join()

        when:
        skillsService.addOrUpdateProjectSetting(proj.projectId, 'project.displayName', label)

        then:
        def ex = thrown(SkillsClientException)
        ex.message.contains("[Project Display Text] must not exceed [20]")
    }

    def "save custom subject label setting with value exceeding max"(){
        def proj = SkillsFactory.createProject()
        skillsService.createProject(proj)

        def label = (1..51).collect{"A"}.join()

        when:
        skillsService.addOrUpdateProjectSetting(proj.projectId, 'subject.displayName', label)

        then:
        def ex = thrown(SkillsClientException)
        ex.message.contains("[Subject Display Text] must not exceed [20]")
    }

    def "save custom group label setting with value exceeding max"(){
        def proj = SkillsFactory.createProject()
        skillsService.createProject(proj)

        def label = (1..51).collect{"A"}.join()

        when:
        skillsService.addOrUpdateProjectSetting(proj.projectId, 'group.displayName', label)

        then:
        def ex = thrown(SkillsClientException)
        ex.message.contains("[Group Display Text] must not exceed [20]")
    }

    def "save custom skill label setting with value exceeding max"(){
        def proj = SkillsFactory.createProject()
        skillsService.createProject(proj)

        def label = (1..51).collect{"A"}.join()

        when:
        skillsService.addOrUpdateProjectSetting(proj.projectId, 'skill.displayName', label)

        then:
        def ex = thrown(SkillsClientException)
        ex.message.contains("[Skill Display Text] must not exceed [20]")
    }

    def "save custom level label setting with value exceeding max"(){
        def proj = SkillsFactory.createProject()
        skillsService.createProject(proj)

        def label = (1..51).collect{"A"}.join()

        when:
        skillsService.addOrUpdateProjectSetting(proj.projectId, 'level.displayName', label)

        then:
        def ex = thrown(SkillsClientException)
        ex.message.contains("[Level Display Text] must not exceed [20]")
    }

    def "return user community if configured"() {
        List<String> users = getRandomUsers(2)

        SkillsService allDragonsUser = createService(users[0])
        SkillsService pristineDragonsUser = createService(users[1])
        SkillsService rootUser = createRootSkillService()
        rootUser.saveUserTag(pristineDragonsUser.userName, 'dragons', ['DivineDragon'])

        def p1 = createProject(1)
        p1.enableProtectedUserCommunity = true
        pristineDragonsUser.createProject(p1)

        def p2 = createProject(2)
        allDragonsUser.createProject(p2)
        allDragonsUser.addProjectAdmin(p2.projectId, pristineDragonsUser.userName)

        when:
        def p1Settings = pristineDragonsUser.getProjectSettings(p1.projectId)
        def p2Settings = pristineDragonsUser.getProjectSettings(p2.projectId)

        def p2SettingsAllDragons = allDragonsUser.getProjectSettings(p2.projectId)

        allDragonsUser.getProjectSettings(p1.projectId)
        then:
        SkillsClientException e = thrown(SkillsClientException)
        e.httpStatus == org.springframework.http.HttpStatus.FORBIDDEN
        p1Settings.find { it.setting == "project_community_value"}?.value == 'Divine Dragon'
        p2Settings.find { it.setting == "project_community_value"}?.value == 'All Dragons'

        p2SettingsAllDragons.find { it.setting == "project_community_value"}?.value == 'All Dragons'
    }

    def 'projects are returned with and without project protection'() {
        def proj = SkillsFactory.createProject(1)
        def proj2 = SkillsFactory.createProject(2)
        skillsService.createProject(proj)
        skillsService.createProject(proj2)

        skillsService.changeSetting(proj2.projectId, "project-deletion-protection", [projectId: proj2.projectId, setting: "project-deletion-protection", value: "true"])
        when:
        def projects = skillsService.getProjects()

        then:
        projects.size() == 2
        !projects[0].isDeleteProtected
        projects[1].isDeleteProtected
    }

    def 'count total users for project'() {
        def proj = createProject(1)
        def subject = SkillsFactory.createSubject()
        def skill1 = SkillsFactory.createSkill(1, 1, 1, 0, 5)
        skill1.pointIncrement = 50

        skillsService.createProject(proj)
        skillsService.createSubject(subject)
        skillsService.createSkill(skill1)

        List<String> users = getRandomUsers(30)

        users.each {user ->
            skillsService.addSkill(skill1, user, new Date().minus(5))
            skillsService.addSkill(skill1, user, new Date().minus(1))
        }

        when:
        def count = skillsService.getProjectUsersCount(proj.projectId)

        then:
        count == users.size()
    }

    def 'project can not be deleted when delete protection is enabled'() {
        def proj = SkillsFactory.createProject(1)
        skillsService.createProject(proj)

        skillsService.changeSetting(proj.projectId, "project-deletion-protection", [projectId: proj.projectId, setting: "project-deletion-protection", value: "true"])
        def projects = skillsService.getProjects()
        assert projects.size() == 1
        assert projects[0].isDeleteProtected

        when:
        skillsService.deleteProject(proj.projectId)

        then:
        def ex = thrown(SkillsClientException)
        ex.message.contains("Project [TestProject1] cannot be deleted as it has deletion protection enabled")
    }
}

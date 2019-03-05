import {ProjectsPage} from "../../projects/projects.po";
import {LoginPage} from "../../login/login.po";
import {browser} from "protractor";
import {DexPage} from "../../dex/dex.po";
import {ConfirmationDialog} from "../../shared/confirmation.po";
import {KMElement} from "../../shared/element-utils";
import {MembersPage} from "../../member/member";
import {ClustersPage} from "../../clusters/clusters.po";
import {CreateClusterPage} from "../../clusters/create/create.po";

/**
 * This is the user story that tests basic kubermatic dashboard features such as:
 *  - login/logout
 *  - CRUD for projects, clusters, members
 *
 * It executes the following steps:
 *  - Login using static credentials as test user 'roxy'
 *  - Create new project called 'e2e-test-project'
 *  - Create new cluster callsed 'e2e-test-cluster' using kubeadm provider
 *  - Add new member
 *  - Edit group of added member
 *  - Delete created resources (member, cluster, project).
 *  - Logout from the application
 */

describe('Basic story', () => {
  const loginPage = new LoginPage();
  const projectsPage = new ProjectsPage();
  const clustersPage = new ClustersPage();
  const createClusterPage = new CreateClusterPage();
  const dexPage = new DexPage();
  const membersPage = new MembersPage();
  const confirmationDialog = new ConfirmationDialog();

  let projectName = 'e2e-test-project';
  const clusterName = 'e2e-test-cluster';
  const providerName = 'bringyourown';
  const datacenterLocation = 'Frankfurt';

  const memberEmail = 'roxy2@kubermatic.io';

  beforeAll(() => {
    loginPage.navigateTo();
    KMElement.waitToAppear(loginPage.getLoginButton());
  });

  it('should login', () => {
    loginPage.getLoginButton().click();
    dexPage.getLoginWithEmailButton().click();

    dexPage.getLoginInput().sendKeys(browser.params.KUBERMATIC_E2E_USERNAME);
    dexPage.getPasswordInput().sendKeys(browser.params.KUBERMATIC_E2E_PASSWORD);

    dexPage.getLoginSubmitButton().click();

    KMElement.waitToAppear(projectsPage.getLogoutButton());
    expect(projectsPage.getLogoutButton().isPresent()).toBeTruthy();
  });

  it('should create a new project', () => {
    projectsPage.navigateTo();
    KMElement.waitForNotifications();
    KMElement.waitToAppear(projectsPage.getAddProjectButton());

    projectsPage.getAddProjectButton().click();
    expect(projectsPage.getAddProjectDialog().isPresent()).toBeTruthy();

    projectsPage.getProjectNameInput().sendKeys(projectName);
    projectsPage.getSaveProjectButton().click();

    KMElement.waitToDisappear(projectsPage.getAddProjectDialog());
    KMElement.waitForRedirect("/clusters");
    // We need to wait for autoredirect after create to finish otherwise it will autoredirect again after too fast page switch.
    browser.sleep(5000);
    projectsPage.navigateTo();
    KMElement.waitForRedirect("/projects");
    KMElement.waitToAppear(projectsPage.getProjectItem(projectName));

    expect(projectsPage.getProjectItem(projectName).isPresent()).toBeTruthy();
  });

  it('should create a new cluster', () => {
    clustersPage.navigateTo();
    KMElement.waitForClickable(clustersPage.getAddClusterTopBtn());

    clustersPage.getCreateClusterNavButton().click();
    KMElement.waitToAppear(createClusterPage.getClusterNameInput());
    createClusterPage.getClusterNameInput().sendKeys(clusterName);
    KMElement.waitForClickable(createClusterPage.getNextButton());
    createClusterPage.getNextButton().click();

    KMElement.waitToAppear(createClusterPage.getProviderButton(providerName));
    createClusterPage.getProviderButton(providerName).click();

    createClusterPage.getDatacenterLocationButton(datacenterLocation).click();

    KMElement.waitForClickable(createClusterPage.getCreateButton());
    createClusterPage.getCreateButton().click();
    KMElement.waitForRedirect('/clusters/');

    clustersPage.navigateTo();
    KMElement.waitToAppear(clustersPage.getClusterItem(clusterName));
    expect(clustersPage.getClusterItem(clusterName).isPresent()).toBeTruthy();
  });

  it('should add a new member', () => {
    membersPage.navigateTo();

    KMElement.waitForNotifications();
    KMElement.waitForClickable(membersPage.getAddMemberBtn());
    membersPage.getAddMemberBtn().click();
    KMElement.waitToAppear(membersPage.getAddMemberDialog());

    KMElement.sendKeys(membersPage.getAddMemberDialogEmailInput(), memberEmail);
    membersPage.getAddMemberDialogGroupCombobox().click();
    membersPage.getAddMemberDialogGroupOption(2).click();
    membersPage.getAddMemberDialogAddBtn().click();

    KMElement.waitToDisappear(membersPage.getAddMemberDialog());
    KMElement.waitToAppear(membersPage.getMemberItem(memberEmail));
    expect(membersPage.getMemberItem(memberEmail).isPresent()).toBeTruthy();
  });

  it('should edit created member info', async () => {
    const memberGroup = await membersPage.getMemberGroup(memberEmail).getText();
    KMElement.waitToAppear(membersPage.getMemberEditBtn(memberEmail));
    membersPage.getMemberEditBtn(memberEmail).click();

    KMElement.waitToAppear(membersPage.getEditMemberDialogGroupCombobox());
    membersPage.getEditMemberDialogGroupCombobox().click();
    membersPage.getEditMemberDialogGroupOption(3).click();
    membersPage.getEditMemberDialogEditBtn().click();

    KMElement.waitToDisappear(membersPage.getEditMemberDialog());

    // Switch views to reload members list
    clustersPage.navigateTo();
    membersPage.navigateTo();

    KMElement.waitToAppear(membersPage.getMemberItem(memberEmail));
    expect(await membersPage.getMemberGroup(memberEmail).getText()).not.toEqual(memberGroup);
  });

  it('should delete created member', () => {
    KMElement.waitForNotifications();
    KMElement.waitToAppear(membersPage.getMemberDeleteBtn(memberEmail));
    membersPage.getMemberDeleteBtn(memberEmail).click();

    KMElement.waitToAppear(confirmationDialog.getConfirmationDialog());
    confirmationDialog.getConfirmationDialogConfirmBtn().click();

    // Switch views to reload members list
    clustersPage.navigateTo();
    membersPage.navigateTo();

    expect(membersPage.getMemberItem(memberEmail).isPresent()).toBeFalsy();
  });

  it('should delete created cluster', () => {
    clustersPage.navigateTo();

    KMElement.waitToAppear(clustersPage.getClusterItem(clusterName));
    clustersPage.getClusterItem(clusterName).click();

    KMElement.waitForNotifications();
    KMElement.waitForClickable(clustersPage.getDeleteClusterBtn());
    clustersPage.getDeleteClusterBtn().click();

    KMElement.waitToAppear(clustersPage.getDeleteClusterDialog());
    KMElement.sendKeys(clustersPage.getDeleteClusterDialogInput(), clusterName);
    KMElement.waitForClickable(clustersPage.getDeleteClusterDialogDeleteBtn());
    clustersPage.getDeleteClusterDialogDeleteBtn().click();

    KMElement.waitToAppear(clustersPage.getAddClusterTopBtn());
    KMElement.waitToDisappear(clustersPage.getClusterItem(clusterName));
    expect(clustersPage.getClusterItem(clusterName).isPresent()).toBeFalsy();
  });

  it('should edit created project name', async () => {
    const oldProjectName = projectName;
    projectsPage.navigateTo();
    KMElement.waitForNotifications();
    KMElement.waitToAppear(projectsPage.getProjectEditBtn(projectName));
    projectsPage.getProjectEditBtn(projectName).click();
    expect(projectsPage.getEditProjectDialog().isPresent()).toBeTruthy();

    KMElement.waitToAppear(projectsPage.getEditProjectDialogInput());
    projectName = 'e2e-test-project-2';
    KMElement.sendKeys(projectsPage.getEditProjectDialogInput(), projectName);
    KMElement.waitForClickable(projectsPage.getEditProjectDialogEditBtn());
    projectsPage.getEditProjectDialogEditBtn().click();

    KMElement.waitToDisappear(projectsPage.getEditProjectDialog());

    KMElement.waitForRedirect('/clusters');
    // We need to wait for autoredirect after edit to finish otherwise it will autoredirect again after too fast page switch.
    browser.sleep(5000);
    projectsPage.navigateTo();
    KMElement.waitForRedirect('/projects');

    KMElement.waitToAppear(projectsPage.getProjectItem(projectName));
    expect(await projectsPage.getProjectItem(projectName).getText()).not.toEqual(oldProjectName);
  });

  it('should delete created project', () => {
    KMElement.waitForNotifications();
    KMElement.waitToAppear(projectsPage.getDeleteProjectButton(projectName));
    projectsPage.getDeleteProjectButton(projectName).click();
    expect(confirmationDialog.getConfirmationDialog().isPresent()).toBeTruthy();

    KMElement.sendKeys(confirmationDialog.getConfirmationDialogInput(), projectName);
    confirmationDialog.getConfirmationDialogConfirmBtn().click();

    KMElement.waitToDisappear(projectsPage.getProjectItem(projectName));
    expect(projectsPage.getProjectItem(projectName).isPresent()).toBeFalsy();
  });

  it('should logout', () => {
    KMElement.waitForNotifications();
    KMElement.waitToAppear(projectsPage.getLogoutButton());
    expect(projectsPage.getLogoutButton().isPresent()).toBeTruthy();

    projectsPage.getLogoutButton().click();

    KMElement.waitToAppear(loginPage.getLoginButton());
    expect(loginPage.getLoginButton().isPresent()).toBeTruthy();
  });
});

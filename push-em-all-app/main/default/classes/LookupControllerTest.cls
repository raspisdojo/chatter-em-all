@isTest
private class LookupControllerTest {
    @TestSetup
    static void makeData() {
        Account testAccount = new Account(Name = 'Test Account');
        insert testAccount;
    }

    @isTest
    private static void testFindSObjects() {
        Account testAccount = [SELECT Id, Name FROM Account LIMIT 1];
        List<LookupController.Result> results = new List<LookupController.Result>();
        Id[] fixedSearchResults = new List<Id>(1);
        fixedSearchResults[0] = testAccount.Id;
        Test.setFixedSearchResults(fixedSearchResults);

        Test.startTest();
        results = LookupController.findSObjects('test', 'Account', 'Name', 'Website');
        Test.stopTest();

        System.assertEquals(false, results.isEmpty(), 'It has to return an account');
        System.assertEquals(testAccount.Name, results[0].title, 'Name has to be the same');
    }
}

import smartpy as sp
class Shopping(sp.Contract):
    def __init__(self,params):
        self.init(orders = sp.map(tkey = sp.TInt , tvalue = sp.TRecord(units = sp.TInt, contactPerson = sp.TString , deliveryAddress = sp.TString , fulfilled = sp.TBool , item=sp.TString)), counter = sp.int(0),admin=params)
        
    def incrementCounter(self):
        self.data.counter += 1
        
    @sp.entry_point
    def purchase(self,params):
        self.incrementCounter()
        orderData = sp.record(units = params.units , contactPerson = params.contactPerson  , deliveryAddress = params.deliveryAddress , item = params.item , fulfilled = False)
        
        self.data.orders[self.data.counter] = orderData
    
    @sp.entry_point
    def closeOrder(self,params):
        sp.verify(sp.sender == self.data.admin)
        self.data.orders[params.orderID].fulfilled = True
        
@sp.add_test(name="DeliverySystem")
def test():
    
    shopping = Shopping(sp.address("tz1SsDtBQYQRuWkbiYrqgxRGCiEkpKxiTy7X"))
    scenario = sp.test_scenario()
    scenario += shopping
    scenario += shopping.purchase(units = 3 , contactPerson = "Jack" , deliveryAddress="301 ABCD Street XYZ City" , item = "Mango")
    scenario += shopping.closeOrder(orderID = 1).run(sender = sp.address("tz1SsDtBQYQRuWkbiYrqgxRGCiEkpKxiTy7X"))
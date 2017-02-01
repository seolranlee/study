function Stack(){

	var items = [];

	this.push = function(element){
		items.push(element);
	};

	this.pop = function(){
		return items.pop();
	};

	this.peek = function(){
		return items[items.length - 1];
	};

	this.isEmpty = function(){
		return items.length == 0;
	};

	this.size = function(){
		return items.length;
	};

	this.clear = function(){
		items = [];
	};

	this.print = function(){
		console.log(items.toString());
	};
}

var stack = new Stack();

console.log(stack.isEmpty());

stack.push(5);
stack.push(8);
console.log(stack.peek());
stack.push(11);
console.log(stack.size());
console.log(stack.isEmpty());
function LinkedList(){

	var Node = function(element){
		this.element = element;	//원소
		this.next = null;	//포인터
	};

	var length = 0;
	var head = null;

	this.append = function(element){

		var node = new Node(element), current;

		if(head == null){
			head = node;
		} else{
			current = head;

			while(current.next){
				current = current.next;
			}

			current.next = node;
		}

		length++;
	};

}

this.toString = function(){

	var current = head, string = '';

	while(current){
		string += current.element;
		current = current.next;
	}
	return string;
};
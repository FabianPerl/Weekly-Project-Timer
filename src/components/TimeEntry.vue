<template>
    <div>
        <span width='200' class='font-weight-bold'>{{ time }}</span> &mdash; {{ topic }} &mdash; {{ description }}
    </div>
</template>

<script>
export default {
    name: 'TimeEntry',
    props: ['time', 'topic', 'description']
}
</script>

<style>

</style>